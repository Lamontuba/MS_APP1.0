"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import { useLeads } from '@/hooks/useLeads';
import type { Lead } from '@/models/lead';

interface AIContextType {
  isAIOpen: boolean;
  toggleAI: () => void;
  leads: Lead[];
  loading: boolean;
  error: string | null;
  user: { uid: string }; // Added the user property with uid
}

const AIContext = createContext<AIContextType>({} as AIContextType);

export function AIProvider({ children }: { children: React.ReactNode }) {
  const [isAIOpen, setIsAIOpen] = useState(false);
  const { leads, loading, error } = useLeads();
  const [user, setUser] = useState<{ uid: string }>({ uid: '' }); // Added the user state

  // Update the user state when the component mounts
  useEffect(() => {
    // Fetch the user information and update the state
    setUser({ uid: 'your-user-uid' }); // Replace with the actual user uid
  }, []);

  return (
    <AIContext.Provider
      value={{
        isAIOpen,
        toggleAI: () => setIsAIOpen(!isAIOpen),
        leads,
        loading,
        error,
        user
      }}
    >
      {children}
    </AIContext.Provider>
  );
}

export const useAI = () => useContext(AIContext);