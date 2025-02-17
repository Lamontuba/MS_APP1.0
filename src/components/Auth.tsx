// src/components/Auth.tsx
"use client";
import { auth, googleProvider } from '@/lib/firebase';
import { signInWithPopup } from 'firebase/auth';
import { FirebaseError } from 'firebase/app'; // Import FirebaseError

export default function Auth() {
  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error: unknown) { // Replace `any` with `unknown`
      if ((error as FirebaseError).code !== 'auth/popup-closed-by-user') {
        console.error(error);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <button 
        onClick={signInWithGoogle}
        className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg"
      >
        Sign in with Google
      </button>
    </div>
  );
}