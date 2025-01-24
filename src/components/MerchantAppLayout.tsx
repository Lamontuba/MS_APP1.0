"use client";

import React, { useState } from "react";
import { Menu, X } from "lucide-react";

// Import modular tool components
import DashboardTool from "@/components/tools/DashboardTool";
import LeadsTool from "@/components/tools/LeadsTool";
import AnalysisTool from "@/components/tools/AnalysisTool";
import FastApp from "@/components/tools/FastApp";

const MerchantAppLayout = () => {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false); // Sidebar state

  const sections = [
    {
      id: "dashboard",
      label: "Dashboard",
      component: DashboardTool,
      accent: "from-blue-500 to-blue-700",
    },
    {
      id: "leads",
      label: "Leads",
      component: LeadsTool,
      accent: "from-pink-500 to-pink-700",
    },
    {
      id: "analysis",
      label: "Analysis",
      component: AnalysisTool,
      accent: "from-indigo-500 to-indigo-700",
    },
    {
      id: "fastapp",
      label: "FastApp",
      component: FastApp,
      accent: "from-green-500 to-green-700",
    },
  ];

  return (
    <div className="bg-black text-white h-screen w-full flex overflow-hidden font-sans">
      {/* Sidebar */}
      <div
        className={`fixed z-40 h-full bg-neutral-900 p-4 border-r border-neutral-800 transition-all duration-300 ${
          isSidebarVisible ? "w-64" : "w-16"
        }`}
      >
        <button
          onClick={() => setIsSidebarVisible(!isSidebarVisible)}
          className="p-2 rounded-full hover:bg-neutral-800 transition"
        >
          {isSidebarVisible ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
        {isSidebarVisible && (
          <div className="mt-4">
            {/* Placeholder for Sidebar Components */}
            <p className="text-neutral-400">Sidebar is empty for now.</p>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 ml-16 lg:ml-64 p-6 grid grid-cols-2 gap-6 max-w-6xl mx-auto">
        {sections.map((section) => (
          <div
            key={section.id}
            className={`relative group cursor-pointer rounded-2xl p-6 bg-gradient-to-br ${section.accent} shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105`}
          >
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold">{section.label}</h3>
            </div>
            <div className="mt-4 bg-white p-4 rounded-lg shadow-inner text-black">
              {React.createElement(section.component)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MerchantAppLayout;
