/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Compass, 
  LayoutDashboard, 
  Sliders, 
  Calendar, 
  FileText, 
  Mic, 
  MessageSquare, 
  Briefcase, 
  Home, 
  User as UserIcon, 
  LogOut, 
  Brain, 
  Sparkles,
  Search,
  Wifi,
  WifiOff
} from 'lucide-react';
import { User } from '../types';

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: User | null;
  onLogout: () => void;
  onOpenLogin: () => void;
  isAiOnline: boolean;
}

export default function Navigation({ 
  activeTab, 
  setActiveTab, 
  user, 
  onLogout, 
  onOpenLogin,
  isAiOnline 
}: NavigationProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const menuItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'dashboard', label: 'My Dashboard', icon: LayoutDashboard },
    { id: 'explorer', label: 'Careers Explorer', icon: Compass },
    { id: 'analyzer', label: 'Gap & Roadmap', icon: Sliders },
    { id: 'study', label: 'Study Planner', icon: Calendar },
    { id: 'resume', label: 'Resume ATS', icon: FileText },
    { id: 'interview', label: 'Interview Prep', icon: Mic },
    { id: 'mentor', label: 'AI Mentor Chat', icon: MessageSquare },
    { id: 'internships', label: 'Internships', icon: Briefcase },
  ];

  return (
    <nav className="w-full md:w-64 bg-slate-900 border-r border-slate-800 text-slate-300 flex flex-col shrink-0">
      {/* Header Brand */}
      <div className="p-5 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
            <Brain className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h1 className="font-bold text-white text-base tracking-tight leading-none">Dream2Skills AI</h1>
            <span className="text-[10px] font-mono text-indigo-400 font-medium tracking-wider uppercase">Career Hub</span>
          </div>
        </div>

        {/* AI Status Pill */}
        <div 
          className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono ${
            isAiOnline 
              ? 'bg-indigo-950 text-indigo-300 border border-indigo-800' 
              : 'bg-amber-950 text-amber-300 border border-amber-800'
          }`}
          title={isAiOnline ? "Gemini AI Engine Online" : "AI Offline / Fallback Enabled"}
        >
          {isAiOnline ? <Wifi className="w-3 h-3 text-indigo-400" /> : <WifiOff className="w-3 h-3 text-amber-400" />}
          <span>{isAiOnline ? 'AI LIVE' : 'AI LOCAL'}</span>
        </div>
      </div>

      {/* User Status Bar */}
      <div className="p-4 bg-slate-950/40 border-b border-slate-800/60">
        {user ? (
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-200 uppercase font-bold text-xs shrink-0">
                {user.name.substring(0, 2)}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-white truncate">{user.name}</p>
                <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
              </div>
            </div>
            <button 
              onClick={onLogout} 
              className="p-1.5 rounded-lg hover:bg-slate-800 hover:text-rose-400 transition"
              title="Logout Profile"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button 
            onClick={onOpenLogin}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium transition duration-200 cursor-pointer shadow-sm"
          >
            <UserIcon className="w-3.5 h-3.5" />
            <span>Connect Profile</span>
          </button>
        )}
      </div>

      {/* Nav Menu Items */}
      <ul className="flex-1 p-3 space-y-1 overflow-y-auto custom-scrollbar">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <li key={item.id}>
              <button
                onClick={() => {
                  setActiveTab(item.id);
                }}
                className={`w-full flex items-center gap-3 py-2.5 px-3 rounded-lg text-xs font-medium tracking-wide transition-all duration-150 cursor-pointer text-left ${
                  isActive 
                    ? 'bg-slate-800 text-white font-semibold border-l-2 border-indigo-500 shadow-sm shadow-indigo-600/5' 
                    : 'hover:bg-slate-800/40 hover:text-slate-100 text-slate-400'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 transition-transform ${isActive ? 'text-indigo-400 scale-110' : 'text-slate-500'}`} />
                <span>{item.label}</span>
                {isActive && (
                  <Sparkles className="w-3 h-3 ml-auto text-indigo-400 animate-pulse" />
                )}
              </button>
            </li>
          );
        })}
      </ul>

      {/* Footer Meta Credits */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/20 text-center">
        <p className="text-[10px] text-slate-500 font-mono">Dream2Skills AI &copy; 2026</p>
        <p className="text-[9px] text-slate-600 font-sans mt-0.5">Optimized for Vercel & Render</p>
      </div>
    </nav>
  );
}
