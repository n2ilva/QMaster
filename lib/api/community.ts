import {
    collection,
    doc,
    getDocs,
    orderBy,
    query,
    serverTimestamp,
    setDoc,
    writeBatch,
} from "firebase/firestore";

import {
    cacheInvalidatePrefix,
    COMMUNITY_TTL,
    fetchWithCache,
} from "@/lib/cache";
import { db } from "@/lib/firebase";
import {
    calculateScore,
    calculateStreak,
    getScoreLevel,
    getSummaryLevel,
    invalidateUserCaches,
} from "./progress";
import type {
    LessonRecord,
    ScoreLevel,
    SummaryLevel,
    UserProfile,
    UserProgressData,
} from "./types";

// ---------------------------------------------------------------------------
// Community / ranking
// ---------------------------------------------------------------------------

/**
 * Atualiza o perfil público do usuário após uma lição completada.
 */
export async function updateUserProfile(
  uid: string,
  userName: string,
): Promise<void> {
  const lessonsRef = collection(db, "users", uid, "lessons");
  const lessonsSnapshot = await getDocs(lessonsRef);

  let totalCorrect = 0;
  let totalQuestions = 0;
  let totalDuration = 0;

  // Aggregate per-category stats
  const categoryMap = new Map<
    string,
    { track: string; correct: number; total: number; duration: number }
  >();

  lessonsSnapshot.docs.forEach((d) => {
    const data = d.data() as LessonRecord;
    totalCorrect += data.correctCount;
    totalQuestions += data.totalCount;
    totalDuration += data.durationMs;
    const key = data.category;
    const existing = categoryMap.get(key);
    if (existing) {
      existing.correct += data.correctCount;
      existing.total += data.totalCount;
      existing.duration += data.durationMs;
    } else {
      categoryMap.set(key, {
        track: data.track ?? "",
        correct: data.correctCount,
        total: data.totalCount,
        duration: data.durationMs,
      });
    }
  });

  // Find top category by most questions answered
  let topCategory: string | undefined;
  let topCategoryTrack: string | undefined;
  let topCategoryAccuracy: number | undefined;
  let topCategoryAvgTimeMs: number | undefined;
  let topTotal = 0;
  categoryMap.forEach((val, key) => {
    if (val.total > topTotal) {
      topTotal = val.total;
      topCategory = key;
      topCategoryTrack = val.track;
      topCategoryAccuracy =
        val.total > 0 ? Math.round((val.correct / val.total) * 100) : 0;
      topCategoryAvgTimeMs =
        val.total > 0 ? Math.round(val.duration / val.total) : 0;
    }
  });

  const avgTimePerQuestion =
    totalQuestions > 0 ? totalDuration / totalQuestions : 0;
  const accuracy =
    totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
  const score = calculateScore(totalQuestions, accuracy, avgTimePerQuestion);
  const summaryLevel = getSummaryLevel(accuracy);
  const scoreLevel = getScoreLevel(score);

  const lessonsForStreak: LessonRecord[] = lessonsSnapshot.docs.map(
    (d) => ({ id: d.id, ...d.data() }) as LessonRecord,
  );
  const streak = calculateStreak(lessonsForStreak);

  const progressRef = doc(db, "users", uid, "progressData", "current");
  const profileRef = doc(db, "community", uid);

  const batch = writeBatch(db);
  batch.set(progressRef, {
    level: summaryLevel,
    scoreLevel,
    score,
    totalQuestionsAnswered: totalQuestions,
    overallAccuracy: accuracy,
    avgTimePerQuestion,
    updatedAt: serverTimestamp(),
  } as UserProgressData);
  batch.set(profileRef, {
    userId: uid,
    name: userName,
    level: summaryLevel,
    scoreLevel,
    score,
    totalQuestionsAnswered: totalQuestions,
    overallAccuracy: accuracy,
    avgTimePerQuestion,
    streak,
    ...(topCategory !== undefined && {
      topCategory,
      topCategoryTrack: topCategoryTrack ?? "",
      topCategoryAccuracy: topCategoryAccuracy ?? 0,
      topCategoryAvgTimeMs: topCategoryAvgTimeMs ?? 0,
    }),
    updatedAt: serverTimestamp(),
  });
  await batch.commit();

  void invalidateUserCaches(uid);
  void cacheInvalidatePrefix("community:");
}

/**
 * Garante que o usuário tem um perfil na comunidade, mesmo sem lições completadas.
 */
export async function ensureUserProfile(
  uid: string,
  userName: string,
): Promise<void> {
  const profileRef = doc(db, "community", uid);
  await setDoc(
    profileRef,
    { userId: uid, name: userName, updatedAt: serverTimestamp() },
    { merge: true },
  );
}

/**
 * Busca todos os usuários ordenados pela pontuação (decrescente).
 */
export async function fetchUsersByLevel(
  level: ScoreLevel,
  limitCount: number = 50,
): Promise<UserProfile[]> {
  return fetchWithCache(
    `community:${level}:${limitCount}`,
    async () => {
      const communityRef = collection(db, "community");
      const q = query(communityRef, orderBy("score", "desc"));
      const snapshot = await getDocs(q);

      return snapshot.docs
        .map((d) => {
          const score = (d.data().score as number) ?? 0;
          return {
            userId: d.id,
            name: (d.data().name as string) ?? "Usuário",
            level: (d.data().level as SummaryLevel) ?? "Iniciante",
            scoreLevel:
              (d.data().scoreLevel as ScoreLevel) ?? getScoreLevel(score),
            score: score,
            totalQuestionsAnswered:
              (d.data().totalQuestionsAnswered as number) ?? 0,
            overallAccuracy: (d.data().overallAccuracy as number) ?? 0,
            avgTimePerQuestion: (d.data().avgTimePerQuestion as number) ?? 0,
            streak: (d.data().streak as number) ?? 0,
            updatedAt: d.data().updatedAt,
            topCategory: (d.data().topCategory as string) ?? undefined,
            topCategoryTrack:
              (d.data().topCategoryTrack as string) ?? undefined,
            topCategoryAccuracy:
              (d.data().topCategoryAccuracy as number) ?? undefined,
            topCategoryAvgTimeMs:
              (d.data().topCategoryAvgTimeMs as number) ?? undefined,
          };
        })
        .filter((user) => user.scoreLevel === level)
        .slice(0, limitCount);
    },
    COMMUNITY_TTL,
  );
}
