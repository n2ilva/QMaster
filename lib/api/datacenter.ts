import { collection, doc, getDocs, serverTimestamp, setDoc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { invalidateUserCaches } from './progress';
import { updateUserProfile } from './community';

export async function saveDataCenterResult(
  uid: string, 
  levelId: number, 
  timeSeconds: number, 
  movements: number
): Promise<void> {
  const docRef = doc(db, 'users', uid, 'datacenterResults', levelId.toString());
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    const existing = docSnap.data();
    const newBestTime = Math.min(existing.bestTime ?? Infinity, timeSeconds);
    const newBestMoves = Math.min(existing.bestMoves ?? Infinity, movements);
    
    await setDoc(docRef, {
      levelId,
      completed: true,
      bestTime: newBestTime,
      bestMoves: newBestMoves,
      lastMovements: movements,
      lastTime: timeSeconds,
      updatedAt: serverTimestamp(),
    }, { merge: true });
  } else {
    await setDoc(docRef, {
      levelId,
      completed: true,
      bestTime: timeSeconds,
      bestMoves: movements,
      lastMovements: movements,
      lastTime: timeSeconds,
      updatedAt: serverTimestamp(),
    });
  }
  
  await invalidateUserCaches(uid);
  await updateUserProfile(uid);
}

export async function fetchDataCenterProgress(uid: string): Promise<Record<string, { completed: boolean; bestTime: number; bestMoves: number }>> {
  const colRef = collection(db, 'users', uid, 'datacenterResults');
  const snapshot = await getDocs(colRef);
  
  const results: Record<string, { completed: boolean; bestTime: number; bestMoves: number }> = {};
  snapshot.docs.forEach(d => {
    const data = d.data();
    results[d.id] = {
      completed: data.completed,
      bestTime: data.bestTime,
      bestMoves: data.bestMoves,
    };
  });
  
  return results;
}
