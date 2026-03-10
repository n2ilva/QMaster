import { useCallback, useEffect, useState } from "react";

import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";

import type { StudyLevel } from "@/data/study-plans";
import { db } from "@/lib/firebase";

export type SavedStudyPlan = {
  id: string;
  track: string;
  trackLabel: string;
  level: StudyLevel;
  firstCategory: string;
  createdAt: number;
  language?: string;
};

function plansRef(uid: string) {
  return collection(db, "users", uid, "studyPlans");
}

/** Lê e persiste a lista de planos de estudo no Firebase. */
export function useStudyPlans(uid: string | undefined) {
  const [plans, setPlans] = useState<SavedStudyPlan[]>([]);

  const fetchPlans = useCallback(async () => {
    if (!uid) return;
    const q = query(plansRef(uid), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    const loaded: SavedStudyPlan[] = snap.docs.map((d) => ({
      ...(d.data() as Omit<SavedStudyPlan, "id">),
      id: d.id,
    }));
    setPlans(loaded);
  }, [uid]);

  useEffect(() => {
    void fetchPlans();
  }, [fetchPlans]);

  const addPlan = useCallback(
    async (plan: Omit<SavedStudyPlan, "id" | "createdAt">) => {
      if (!uid) return;
      const id = `${plan.track}_${plan.level}${plan.language ? `_${plan.language}` : ""}`;
      const ref = doc(db, "users", uid, "studyPlans", id);
      const entry: SavedStudyPlan = {
        ...plan,
        id,
        createdAt: Date.now(),
      };
      await setDoc(ref, { ...entry, updatedAt: serverTimestamp() });
      setPlans((prev) => {
        const filtered = prev.filter((p) => p.id !== id);
        return [entry, ...filtered];
      });
    },
    [uid],
  );

  const removePlan = useCallback(
    async (id: string) => {
      if (!uid) return;
      const ref = doc(db, "users", uid, "studyPlans", id);
      await deleteDoc(ref);
      setPlans((prev) => prev.filter((p) => p.id !== id));
    },
    [uid],
  );

  return { plans, addPlan, removePlan, refresh: fetchPlans };
}
