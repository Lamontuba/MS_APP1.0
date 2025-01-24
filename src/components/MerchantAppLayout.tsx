"use client";

import React, { useState } from 'react';
import { 
  Home, 
  Users, 
  BarChart2, 
  FilePlus,
  Menu,
  X,
  TrendingUp,
  Target,
  Layers
} from 'lucide-react';
import FastApp from "@/components/tools/FastApp";

type ToolSection = {
  id: string;
  label: string;
  icon: React.ReactNode;
  accent: string;
  component?: React.ReactNode;
  description: string;
  statsIcon?: React.ReactNode;
  stats?: { label: string; value: string }[];
};

const MerchantAppLayout = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const sections: ToolSection[] = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <Home className="w-10 h-10 text-white opacity-80" />,
      accent: "from-blue-500 to-blue-700",
      description: 'Performance overview',
      component: <div>Dashboard Content</div>,
      statsIcon: <TrendingUp className="w-10 h-10 text-blue-300 opacity-70" />,
      stats: [
        { label: 'Revenue', value: '$124,350' },
        { label: 'Leads', value: '42' }
      ]
    },
    {
      id: "leads",
      label: "Leads",
      icon: <Users className="w-10 h-10 text-white opacity-80" />,
      accent: "from-pink-500 to-pink-700",
      description: 'Lead management',
      component: <div>Leads Content</div>,
      statsIcon: <Target className="w-10 h-10 text-pink-300 opacity-70" />,
      stats: [
        { label: 'Active', value: '53' },
        { label: 'Value', value: '$780K' }
      ]
    },
    {
      id: "analysis",
      label: "Analysis",
      icon: <BarChart2 className="w-10 h-10 text-white opacity-80" />,
      accent: "from-indigo-500 to-indigo-700",
      description: 'Data insights',
      component: <div>Analysis Content</div>,
      statsIcon: <Layers className="w-10 h-10 text-indigo-300 opacity-70" />,
      stats: [
        { label: 'Reports', value: '12' },
        { label: 'Growth', value: '24%' }
      ]
    },
    {
      id: "fastapp",
      label: "FastApp",
      icon: <FilePlus className="w-10 h-10 text-white opacity-80" />,
      accent: "from-green-500 to-green-700",
      description: 'Quick actions',
      component: <FastApp />,
      statsIcon: <FilePlus className="w-10 h-10 text-green-300 opacity-70" />,
      stats: [
        { label: 'Pending', value: '8' },
        { label: 'Complete', value: '16' }
      ]
    }
  ];

  return (
    <div className="bg-black text-white h-screen w-full flex flex-col overflow-hidden">
      {/* Top Navigation */}
      <div className="bg-neutral-900/90 backdrop-blur-xl p-4 flex justify-between items-center border-b border-neutral-800">
        <button 
          onClick={() => setIsSidebarVisible(!isSidebarVisible)}
          className="p-2 rounded-full hover:bg-neutral-800 transition"
        >
          {isSidebarVisible ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
        <h1 className="text-xl font-semibold tracking-tight">Merchant</h1>
        <div className="w-10" />
      </div>

      <div className="flex-1 relative overflow-hidden">
        {/* Sidebar */}
        {isSidebarVisible && (
          <div className="absolute left-0 top-0 h-full w-64 bg-neutral-900/90 backdrop-blur-xl z-50 border-r border-neutral-800">
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-6">Tools</h2>
              {sections.map((section) => (
                <button 
                  key={section.id}
                  onClick={() => {
                    setActiveSection(section.id);
                    setIsSidebarVisible(false);
                    setActiveModal(section.id);
                  }}
                  className={`
                    w-full text-left p-3 rounded-xl mb-2 
                    transition-all duration-300 flex items-center
                    ${activeSection === section.id ? 'bg-white/10' : 'hover:bg-white/5'}
                  `}
                >
                  <span className="mr-3 opacity-70">{section.icon}</span>
                  <span>{section.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Grid Layout */}
        <div className="p-4 grid grid-cols-2 gap-4">
          {sections.map((section) => (
            <div
              key={section.id}
              onClick={() => setActiveModal(section.id)}
              className={`
                bg-gradient-to-br ${section.accent}
                rounded-3xl p-6
                cursor-pointer
                transform transition-all duration-300
                hover:scale-105
              `}
            >
              <div className="flex justify-between items-start">
                <div>
                  {section.icon}
                  <h3 className="text-xl font-bold mt-4">{section.label}</h3>
                  <p className="text-sm opacity-70">{section.description}</p>
                </div>
                {section.statsIcon}
              </div>
              {section.stats && (
                <div className="mt-6 flex justify-between">
                  {section.stats.map((stat, i) => (
                    <div key={i}>
                      <p className="text-xs opacity-60">{stat.label}</p>
                      <p className="text-lg font-bold">{stat.value}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {activeModal && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-xl flex items-center justify-center z-50 p-4"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="bg-neutral-900 w-full max-w-4xl h-[85vh] rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-neutral-800/50 p-4 flex justify-between items-center border-b border-neutral-700">
              <h2 className="text-2xl font-semibold">
                {sections.find(s => s.id === activeModal)?.label}
              </h2>
              <button
                onClick={() => setActiveModal(null)}
                className="bg-neutral-700/50 hover:bg-neutral-600/50 rounded-full p-2"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 overflow-auto h-[calc(85vh-60px)]">
              {sections.find(s => s.id === activeModal)?.component}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MerchantAppLayout;