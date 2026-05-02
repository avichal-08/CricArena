"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ClipboardList, Activity, ChevronLeft } from "lucide-react";

export default function AdminNav() {
  const pathname = usePathname();

  const tabs = [
    { 
      name: "Pre-Match Info", 
      path: "/admin/pre-match", 
      icon: ClipboardList,
      description: "Toss, Venue & Lineups"
    },
    { 
      name: "Live Scoring", 
      path: "/admin/scoring", 
      icon: Activity,
      description: "Ball-by-ball updates"
    },
  ];

  return (
    <div className="bg-background backdrop-blur-md border-b border-white/[0.05] sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4 md:px-8 pt-6">
        <Link href="/" className="inline-flex items-center text-xs text-stone-500 hover:text-stone-300 mb-6 transition-colors">
            <ChevronLeft className="w-4 h-4 mr-1" /> Back to App
        </Link>
        
        <div className="mb-6">
          <h1 className="text-2xl font-black text-white tracking-tight">Admin Control Center</h1>
          <p className="text-sm text-stone-400 mt-1 font-medium">Manage live match data and configurations</p>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => {
            const isActive = pathname.startsWith(tab.path);
            const Icon = tab.icon;
            
            return (
              <Link 
                key={tab.path}
                href={tab.path}
                className={`relative px-4 py-3 rounded-t-xl border-b-2 flex items-center gap-3 transition-all min-w-[180px] ${
                  isActive 
                    ? "border-orange-500 bg-white/[0.03] text-white" 
                    : "border-transparent text-stone-500 hover:text-stone-300 hover:bg-white/[0.02]"
                }`}
              >
                <div className={`p-1.5 rounded-lg ${isActive ? 'bg-orange-500/10' : 'bg-white/[0.05]'}`}>
                  <Icon className={`w-4 h-4 ${isActive ? 'text-orange-500' : 'text-stone-400'}`} />
                </div>
                <div>
                  <div className={`text-sm font-bold ${isActive ? 'text-white' : ''}`}>{tab.name}</div>
                  <div className="text-[10px] font-medium tracking-wide opacity-70">{tab.description}</div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}