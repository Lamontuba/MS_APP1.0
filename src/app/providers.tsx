// src/app/providers.tsx
"use client";

import { AIProvider } from '@/context/AIContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return <AIProvider>{children}</AIProvider>;
}