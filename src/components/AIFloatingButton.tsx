// src/components/AIFloatingButton.tsx
"use client";
import { useAI } from '@/context/AIContext';
import { MessageCircle } from 'lucide-react';

export default function AIFloatingButton() {
  const { toggleAI } = useAI();

  return (
    <button
      onClick={toggleAI}
      className="fixed bottom-6 right-6 p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-lg hover:scale-110 transition-all"
    >
      <MessageCircle className="w-8 h-8 text-white" />
    </button>
  );
}