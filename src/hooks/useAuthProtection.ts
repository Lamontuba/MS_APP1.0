// src/hooks/useAuthProtection.ts
"use client"
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';

export function useAuthProtection() {
  const router = useRouter();

  useEffect(() => {
    return auth.onAuthStateChanged((user) => {
      if (!user) router.push('/');
    });
  }, [router]);
}