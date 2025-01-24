"use client";

import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { db } from '@/lib/firebase';
import { getDocs, collection, query, orderBy, limit } from 'firebase/firestore';

interface Sale {
  id: string;
  amount: number;
  customerName: string;
  timestamp: any;
}

interface Stats {
  revenue: number;
  leads: number;
  growth: number;
}

export default function DashboardTool() {
  const [timeframe, setTimeframe] = useState('week');
  const [sales, setSales] = useState<Sale[]>([]);
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [stats, setStats] = useState<Stats>({
    revenue: 124350,
    leads: 42,
    growth: 12.5
  });

  const [salesData] = useState([
    { date: 'Jan', revenue: 65000 },
    { date: 'Feb', revenue: 78000 },
    { date: 'Mar', revenue: 92000 },
    { date: 'Apr', revenue: 124350 },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const salesQuery = query(
          collection(db, 'sales'),
          orderBy('timestamp', 'desc'),
          limit(3)
        );
        const salesDocs = await getDocs(salesQuery);
        const salesData = salesDocs.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Sale[];
        setSales(salesData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [timeframe]);

  return (
    <div className="space-y-6 bg-zinc-950 p-6 rounded-3xl text-white">
      {/* Timeframe Filter */}
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

      {/* Stats Overview */}
      <div className="bg-zinc-900/50 rounded-2xl p-6 border border-zinc-800">
        <h2 className="text-2xl font-bold text-white mb-6">
          Performance Overview
        </h2>
        
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
            <span className="text-sm text-zinc-400">Total Revenue</span>
            <div className="text-3xl font-bold mt-2 text-white">
              ${stats.revenue.toLocaleString()}
            </div>
            <div className="flex items-center mt-2 text-emerald-500 text-sm">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              +{stats.growth}% from last month
            </div>
          </div>

          <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
            <span className="text-sm text-zinc-400">Leads Converted</span>
            <div className="text-3xl font-bold mt-2 text-white">
              {stats.leads}
            </div>
            <div className="flex items-center mt-2 text-emerald-500 text-sm">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              +8.3% from last month
            </div>
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="mt-6 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={salesData}>
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
                dataKey="revenue" 
                stroke="#10B981" 
                strokeWidth={2}
                dot={{ fill: '#10B981' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-zinc-900/50 rounded-2xl p-6 border border-zinc-800">
        <h3 className="text-xl font-bold text-white mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {[1, 2, 3].map((_, i) => (
            <div 
              key={i} 
              className="flex items-center justify-between p-4 bg-zinc-900 rounded-xl border border-zinc-800 cursor-pointer hover:bg-zinc-800/50 transition-colors"
              onClick={() => setSelectedSale(sales[i] || null)}
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center">
                  <svg className="w-5 h-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-white">New Sale Completed</p>
                  <p className="text-sm text-zinc-400">John Doe • 2 hours ago</p>
                </div>
              </div>
              <span className="text-lg font-medium text-white">$2,400</span>
            </div>
          ))}
        </div>
      </div>

      {/* Sale Details Modal */}
      {selectedSale && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setSelectedSale(null)}
        >
          <div 
            className="bg-zinc-900 p-6 rounded-2xl max-w-lg w-full mx-4 border border-zinc-800"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold">Sale Details</h3>
              <button 
                onClick={() => setSelectedSale(null)}
                className="text-zinc-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-zinc-400 text-sm">Amount</p>
                <p className="text-xl font-bold">${selectedSale.amount}</p>
              </div>
              <div>
                <p className="text-zinc-400 text-sm">Customer</p>
                <p>{selectedSale.customerName}</p>
              </div>
              <div>
                <p className="text-zinc-400 text-sm">Date</p>
                <p>{selectedSale.timestamp.toDate().toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}