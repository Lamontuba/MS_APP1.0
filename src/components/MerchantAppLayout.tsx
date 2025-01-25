"use client";

import React, { useState } from 'react';
import { 
 Home, Users, BarChart2, FilePlus,
 Menu, X, TrendingUp, Target, 
 Layers, ChevronRight, LogOut 
} from 'lucide-react';
import FastApp from "@/components/tools/FastApp";
import DashboardTool from "@/components/tools/DashboardTool";
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';

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
     icon: <Home className="w-10 h-10 text-white drop-shadow-glow" />,
     accent: "from-cyan-400 via-blue-500 to-blue-600",
     description: 'Performance overview',
     component: <DashboardTool />,
     statsIcon: <TrendingUp className="w-10 h-10 text-cyan-300 drop-shadow-glow" />,
     stats: [{ label: 'Revenue', value: '$124,350' }, { label: 'Leads', value: '42' }]
   },
   {
     id: "leads",
     label: "Leads",
     icon: <Users className="w-10 h-10 text-white drop-shadow-glow" />,
     accent: "from-fuchsia-500 via-purple-500 to-violet-600",
     description: 'Lead management',
     component: <div>Leads Content</div>,
     statsIcon: <Target className="w-10 h-10 text-fuchsia-300 drop-shadow-glow" />,
     stats: [{ label: 'Active', value: '53' }, { label: 'Value', value: '$780K' }]
   },
   {
     id: "analysis",
     label: "Analysis",
     icon: <BarChart2 className="w-10 h-10 text-white drop-shadow-glow" />,
     accent: "from-purple-400 via-violet-500 to-fuchsia-600",
     description: 'Data insights',
     component: <div>Analysis Content</div>,
     statsIcon: <Layers className="w-10 h-10 text-purple-300 drop-shadow-glow" />,
     stats: [{ label: 'Reports', value: '12' }, { label: 'Growth', value: '24%' }]
   },
   {
     id: "fastapp",
     label: "FastApp",
     icon: <FilePlus className="w-10 h-10 text-white drop-shadow-glow" />,
     accent: "from-rose-400 via-pink-500 to-purple-600",
     description: 'Quick actions',
     component: <FastApp />,
     statsIcon: <FilePlus className="w-10 h-10 text-rose-300 drop-shadow-glow" />,
     stats: [{ label: 'Pending', value: '8' }, { label: 'Complete', value: '16' }]
   }
 ];

 return (
   <div className="bg-zinc-950 text-white min-h-screen w-full flex flex-col overflow-hidden">
     <div className="bg-black/40 backdrop-blur-2xl p-4 flex justify-between items-center border-b border-white/5">
       <button 
         onClick={() => setIsSidebarVisible(!isSidebarVisible)}
         className="p-2 rounded-xl hover:bg-white/5 transition-all duration-300"
       >
         {isSidebarVisible ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
       </button>
       <h1 className="text-xl font-medium tracking-tight">Merchant <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-400">OS</span></h1>
       <div className="w-10" />
     </div>

     <div className="flex-1 relative overflow-hidden">
       {isSidebarVisible && (
         <div className="absolute left-0 top-0 h-full w-72 bg-black/40 backdrop-blur-2xl z-50 border-r border-white/5 flex flex-col">
           <div className="p-4 flex-1">
             <h2 className="text-xl font-medium mb-8 ml-2">Tools</h2>
             {sections.map((section) => (
               <button 
                 key={section.id}
                 onClick={() => {
                   setActiveSection(section.id);
                   setIsSidebarVisible(false);
                   setActiveModal(section.id);
                 }}
                 className={`
                   w-full text-left p-4 rounded-2xl mb-2 
                   transition-all duration-500 flex items-center justify-between
                   hover:scale-[0.98] group
                   ${activeSection === section.id 
                     ? 'bg-gradient-to-r from-white/10 to-white/5 text-white' 
                     : 'hover:bg-white/5 text-white/70'
                   }
                 `}
               >
                 <div className="flex items-center">
                   <span className="mr-3">{section.icon}</span>
                   <span className="font-medium">{section.label}</span>
                 </div>
                 <ChevronRight className="w-5 h-5 opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0" />
               </button>
             ))}
           </div>
           <button 
             onClick={() => signOut(auth)}
             className="p-4 flex items-center text-red-400 hover:bg-white/5 transition-all duration-300 border-t border-white/5"
           >
             <LogOut className="w-5 h-5 mr-3" />
             <span>Sign Out</span>
           </button>
         </div>
       )}

       <div className="p-6 grid grid-cols-2 gap-6">
         {sections.map((section) => (
           <div
             key={section.id}
             onClick={() => setActiveModal(section.id)}
             className={`
               bg-black/40 backdrop-blur-2xl rounded-3xl p-8
               cursor-pointer transform transition-all duration-500
               hover:scale-[0.98] group relative overflow-hidden
               border border-white/20 shadow-lg hover:shadow-2xl
               hover:border-white/30
               after:absolute after:inset-0 after:bg-gradient-to-br after:from-white/5 after:to-white/0
               before:absolute before:inset-0 before:bg-gradient-to-br ${section.accent} before:opacity-40 before:group-hover:opacity-50
             `}
           >
             <div className="relative z-10">
               <div className="flex justify-between items-start">
                 <div>
                   <div className="group-hover:animate-pulse">
                     {section.icon}
                   </div>
                   <h3 className="text-2xl font-bold mt-4 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/70">
                     {section.label}
                   </h3>
                   <p className="text-sm text-white/70 mt-1">{section.description}</p>
                 </div>
                 <div className="opacity-80 group-hover:opacity-100 transition-opacity duration-500 group-hover:animate-pulse">
                   {section.statsIcon}
                 </div>
               </div>
               {section.stats && (
                 <div className="mt-8 flex justify-between">
                   {section.stats.map((stat, i) => (
                     <div key={i}>
                       <p className="text-xs text-white/70">{stat.label}</p>
                       <p className="text-xl font-bold mt-1 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/90 tracking-tight">
                         {stat.value}
                       </p>
                     </div>
                   ))}
                 </div>
               )}
             </div>
           </div>
         ))}
       </div>
     </div>

     {activeModal && (
       <div
         className="fixed inset-0 bg-black/90 backdrop-blur-xl flex items-center justify-center z-50 p-4"
         onClick={() => setActiveModal(null)}
       >
         <div
           className="bg-zinc-900/80 backdrop-blur-xl w-full max-w-4xl h-[85vh] rounded-3xl shadow-2xl overflow-hidden border border-white/10"
           onClick={(e) => e.stopPropagation()}
         >
           <div className="bg-black/40 p-4 flex justify-between items-center border-b border-white/5">
             <h2 className="text-2xl font-medium">
               {sections.find(s => s.id === activeModal)?.label}
             </h2>
             <button
               onClick={() => setActiveModal(null)}
               className="hover:bg-white/5 rounded-xl p-2 transition-colors duration-300"
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