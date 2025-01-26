"use client";

import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { db, auth } from '@/lib/firebase';
import { getDocs, collection, query, where, orderBy, limit } from 'firebase/firestore';
import type { Lead } from '@/lib/firebase';

export default function DashboardTool() {
 const [timeframe, setTimeframe] = useState('week');
 const [leads, setLeads] = useState<Lead[]>([]);
 const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

 useEffect(() => {
   const fetchLeads = async () => {
     if (!auth.currentUser) return;
     const leadsQuery = query(
       collection(db, 'leads'),
       where('userId', '==', auth.currentUser.uid),
       orderBy('createdAt', 'desc')
     );
     const leadsSnapshot = await getDocs(leadsQuery);
     const leadsData = leadsSnapshot.docs.map(doc => ({
       id: doc.id,
       ...doc.data()
     })) as Lead[];
     setLeads(leadsData);
   };

   fetchLeads();
 }, []);

 const stats = {
   revenue: leads.reduce((sum, lead) => sum + lead.value, 0),
   totalLeads: leads.length,
   activeLeads: leads.filter(l => l.status !== 'closed').length
 };

 return (
   <div className="space-y-6 bg-zinc-950 p-6 rounded-3xl text-white">
     <div className="flex gap-2">
       {['day', 'week', 'month', 'year'].map(period => (
         <button
           key={period}
           onClick={() => setTimeframe(period)}
           className={`px-4 py-2 rounded-lg transition-colors ${
             timeframe === period 
               ? 'bg-zinc-800 text-white' 
               : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800'
           }`}
         >
           {period.charAt(0).toUpperCase() + period.slice(1)}
         </button>
       ))}
     </div>

     <div className="bg-zinc-900/50 rounded-2xl p-6 border border-zinc-800">
       <h2 className="text-2xl font-bold text-white mb-6">Performance Overview</h2>
       
       <div className="grid grid-cols-2 gap-6">
         <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
           <span className="text-sm text-zinc-400">Total Revenue</span>
           <div className="text-3xl font-bold mt-2 text-white">
             ${stats.revenue.toLocaleString()}
           </div>
         </div>

         <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
           <span className="text-sm text-zinc-400">Active Leads</span>
           <div className="text-3xl font-bold mt-2 text-white">
             {stats.activeLeads}
           </div>
         </div>
       </div>

       <div className="mt-6 h-64">
         <ResponsiveContainer width="100%" height="100%">
           <LineChart data={leads.map(lead => ({
             date: new Date(lead.createdAt).toLocaleDateString(),
             value: lead.value
           }))}>
             <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
             <XAxis dataKey="date" stroke="#9CA3AF" />
             <YAxis stroke="#9CA3AF" />
             <Tooltip 
               contentStyle={{ 
                 backgroundColor: '#18181B',
                 border: '1px solid #374151' 
               }}
             />
             <Line 
               type="monotone" 
               dataKey="value" 
               stroke="#10B981" 
               strokeWidth={2}
               dot={{ fill: '#10B981' }}
             />
           </LineChart>
         </ResponsiveContainer>
       </div>
     </div>

     <div className="bg-zinc-900/50 rounded-2xl p-6 border border-zinc-800">
       <h3 className="text-xl font-bold text-white mb-4">Recent Leads</h3>
       <div className="space-y-3">
         {leads.slice(0, 3).map((lead) => (
           <div 
             key={lead.id} 
             className="flex items-center justify-between p-4 bg-zinc-900 rounded-xl border border-zinc-800 cursor-pointer hover:bg-zinc-800/50 transition-colors"
             onClick={() => setSelectedLead(lead)}
           >
             <div className="flex items-center gap-4">
               <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center">
                 <svg className="w-5 h-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                 </svg>
               </div>
               <div>
                 <p className="font-medium text-white">{lead.clientName}</p>
                 <p className="text-sm text-zinc-400">
                   {new Date(lead.createdAt).toLocaleDateString()}
                 </p>
               </div>
             </div>
             <span className="text-lg font-medium text-white">${lead.value.toLocaleString()}</span>
           </div>
         ))}
       </div>
     </div>

     {selectedLead && (
       <div 
         className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
         onClick={() => setSelectedLead(null)}
       >
         <div 
           className="bg-zinc-900 p-6 rounded-2xl max-w-lg w-full mx-4 border border-zinc-800"
           onClick={e => e.stopPropagation()}
         >
           <div className="flex justify-between items-start mb-4">
             <h3 className="text-xl font-bold">Lead Details</h3>
             <button 
               onClick={() => setSelectedLead(null)}
               className="text-zinc-400 hover:text-white"
             >
               ✕
             </button>
           </div>
           <div className="space-y-4">
             <div>
               <p className="text-zinc-400 text-sm">Value</p>
               <p className="text-xl font-bold">${selectedLead.value.toLocaleString()}</p>
             </div>
             <div>
               <p className="text-zinc-400 text-sm">Client</p>
               <p>{selectedLead.clientName}</p>
             </div>
             <div>
               <p className="text-zinc-400 text-sm">Status</p>
               <p className="capitalize">{selectedLead.status}</p>
             </div>
             <div>
               <p className="text-zinc-400 text-sm">Created</p>
               <p>{new Date(selectedLead.createdAt).toLocaleDateString()}</p>
             </div>
           </div>
         </div>
       </div>
     )}
   </div>
 );
}