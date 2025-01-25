"use client"
import Auth from '@/components/Auth';
import { auth } from '@/lib/firebase';
import { useEffect, useState } from 'react';
import MerchantAppLayout from '@/components/MerchantAppLayout';

export default function Home() {
  const [user, setUser] = useState(auth.currentUser);

  useEffect(() => {
    return auth.onAuthStateChanged(setUser);
  }, []);

  return (
    <div>
      {!user ? (
        <Auth />
      ) : (
        <MerchantAppLayout />
      )}
    </div>
  );
}