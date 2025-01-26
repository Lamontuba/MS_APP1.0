// src/lib/leads.ts

import { db } from './firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, where, Timestamp } from 'firebase/firestore';
import type { Lead } from './firebase';

export async function createLead(leadData: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>) {
  return addDoc(collection(db, 'leads'), {
    ...leadData,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  });
}

export async function updateLead(id: string, data: Partial<Lead>) {
  const docRef = doc(db, 'leads', id);
  return updateDoc(docRef, {
    ...data,
    updatedAt: Timestamp.now()
  });
}

export async function getLeadsByUser(userId: string) {
  const q = query(collection(db, 'leads'), where('userId', '==', userId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}