// src/app/(protected)/dashboard/page.tsx
"use client"
import { useAuthProtection } from '../../hooks/useAuthProtection';

export default function Dashboard() {
  useAuthProtection();
  
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Dashboard</h1>
    </div>
  );
}