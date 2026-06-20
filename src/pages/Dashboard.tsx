/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  TrendingUp, 
  CheckCircle, 
  BookOpen, 
  Award, 
  Sparkles, 
  ArrowRight, 
  Calendar,
  XCircle,
  HelpCircle,
  Clock,
  ChevronRight
} from 'lucide-react';
import { User, CareerGoal, UserSkill } from '../types';

interface DashboardProps {
  user: User | null;
  goal: CareerGoal | null;
  skills: UserSkill[];
  onToggleSkill: (skillId: string, completed: boolean) => Promise<void>;
  onNavigateTab: (tab: string) => void;
  isLoading: boolean;
}

export default function Dashboard({ 
  user, 
  goal, 
  skills, 
  onToggleSkill, 
  onNavigateTab,
  isLoading 
}: DashboardProps) {
  const [toggleLoading, setToggleLoading] = useState<string | null>(null);

  const completedSkills = skills.filter((s) => s.completed);
  const remainingSkills = skills.filter((s) => !s.completed);
  const readiness = goal ? goal.readinessScore : 0;

  const handleCheckboxClick = async (skillId: string, currentVal: boolean) => {
    setToggleLoading(skillId);
    try {
      await onToggleSkill(skillId, !currentVal);
    } catch (e) {
      console.error(e);
    } finally {
      setToggleLoading(null);
    }
  };

  // SVG Gauge Calculations
  const radius = 55;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (readiness / 100) * circumference;

  // Render hand-crafted SVG area chart data points
  // Map simulated milestones corresponding to completion levels
  const chartData = [
    { label: 'Base', score: 12 },
    { label: 'Week 1', score: Math.round(readiness * 0.4) },
    { label: 'Week 2', score: Math.round(readiness * 0.6) },
    { label: 'Today', score: readiness }
  ];

  return (
    <div className="flex-1 p-6 overflow-y-auto bg-slate-950 text-slate-100 min-h-screen">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-slate-900 mb-6">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <LayoutDashboard className="w-5 h-5 text-indigo-500" />
            <span>My Accelerator Dashboard</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Welcome back, <span className="text-slate-200 font-semibold">{user?.name || 'Explorer'}</span>. Track skills and manage study checklists.
          </p>
        </div>

        {goal && (
          <div className="flex items-center gap-2 py-1.5 px-3 bg-indigo-950/40 border border-indigo-900/60 rounded-xl">
            <span className="text-[10px] uppercase font-mono font-bold text-indigo-400 tracking-wider">Goal Focus:</span>
            <span className="text-xs font-extrabold text-white">{goal.targetCareer}</span>
          </div>
        )}
      </div>

      {!goal ? (
        /* Empty Dashboard Call-To-Action */
        <div className="max-w-xl mx-auto my-12 text-center p-8 bg-slate-900/40 border border-slate-850 rounded-2xl space-y-5">
          <div className="w-12 h-12 rounded-xl bg-indigo-950 text-indigo-400 flex items-center justify-center mx-auto shadow-md">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">No Career Target Mapped Yet</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Define your dream career and input existing skills. Our AI engine will catalog essential industry competencies, assess readiness, and compile custom interactive courses for you.
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('analyzer')}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg transition duration-150 cursor-pointer flex items-center gap-1.5 mx-auto"
          >
            <span>Analyze Skill Gaps Now</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        /* Dashboard Active Layout */
        <div className="space-y-6 max-w-6xl mx-auto">
          {/* Top Widgets Panel */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            
            {/* Widget 1: Readiness Gauge */}
            <div className="p-4 bg-slate-905 bg-slate-900/50 border border-slate-850 rounded-2xl flex items-center justify-between gap-2">
              <div className="space-y-1">
                <span className="text-[9px] uppercase tracking-wider text-slate-500 font-bold font-mono">Readiness Factor</span>
                <p className="text-2xl font-extrabold text-white tracking-tight">{readiness}%</p>
                <p className="text-[10px] text-slate-400 leading-normal">Score relative to required typical skills.</p>
              </div>

              {/* High-quality circular SVG Dial */}
              <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="32"
                    cy="32"
                    r="26"
                    className="stroke-slate-800"
                    strokeWidth="4"
                    fill="transparent"
                  />
                  <circle
                    cx="32"
                    cy="32"
                    r="26"
                    className="stroke-indigo-500 transition-all duration-500 ease-out"
                    strokeWidth="4.5"
                    fill="transparent"
                    strokeDasharray={2 * Math.PI * 26}
                    strokeDashoffset={2 * Math.PI * 26 - (readiness / 100) * (2 * Math.PI * 26)}
                  />
                </svg>
                <span className="absolute text-[11px] font-bold text-white font-mono">{readiness}%</span>
              </div>
            </div>

            {/* Widget 2: Acquired Skills */}
            <div className="p-4 bg-slate-900/50 border border-slate-850 rounded-2xl space-y-1">
              <div className="flex justify-between items-start">
                <span className="text-[9px] uppercase tracking-wider text-slate-500 font-bold font-mono">Expert Competencies</span>
                <CheckCircle className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-2xl font-extrabold text-white tracking-tight">{completedSkills.length} <span className="text-xs text-slate-400 font-medium font-sans">/ {skills.length}</span></p>
              <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2.5 overflow-hidden">
                <div 
                  className="bg-emerald-500 h-full rounded-full transition-all duration-300" 
                  style={{ width: `${Math.max(3, Math.min(100, (completedSkills.length / (skills.length || 1)) * 100))}%` }}
                />
              </div>
              <p className="text-[10px] text-slate-500 pt-1.5">{remainingSkills.length} core gaps remain to address.</p>
            </div>

            {/* Widget 3: Project Track */}
            <div className="p-4 bg-slate-900/50 border border-slate-850 rounded-2xl space-y-1">
              <div className="flex justify-between items-start">
                <span className="text-[9px] uppercase tracking-wider text-slate-500 font-bold font-mono">Portfolio Milestones</span>
                <Award className="w-4 h-4 text-indigo-400 font-semibold" />
              </div>
              <p className="text-2xl font-extrabold text-white tracking-tight">3 Phase <span className="text-xs text-indigo-400 font-medium font-sans font-mono tracking-wider uppercase">Roadmap</span></p>
              <p className="text-[10px] text-slate-400 pt-2 leading-loose">Beginner, Intermediate & Advanced tasks active.</p>
            </div>

            {/* Widget 4: Study Speed */}
            <div className="p-4 bg-slate-900/50 border border-slate-850 rounded-2xl bg-gradient-to-br from-slate-900/40 via-slate-900/80 to-indigo-950/15">
              <div className="flex justify-between items-start mb-1">
                <span className="text-[9px] uppercase tracking-wider text-indigo-400 font-bold font-mono">AI Study Planner</span>
                <Calendar className="w-4 h-4 text-indigo-400 shrink-0" />
              </div>
              <p className="text-xs font-bold text-white mb-0.5">Flexible Timetable</p>
              <p className="text-[10px] text-slate-400 leading-normal">Align hours to deadlines directly.</p>
              <button 
                onClick={() => onNavigateTab('study')}
                className="mt-3 text-[10px] text-indigo-400 font-bold hover:underline flex items-center gap-0.5 cursor-pointer"
              >
                <span>Run Study Planner</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Central Layout: Grid Charts Area vs Checklist */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            
            {/* Checklist Column */}
            <div className="lg:col-span-7 bg-slate-900/45 border border-slate-850 rounded-2xl p-5 space-y-4">
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono text-indigo-400">Interactive Track Checklist</h3>
                <p className="text-[10px] text-slate-400 mt-1">Check completed items when acquired to recalculate readiness.</p>
              </div>

              {skills.length === 0 ? (
                <p className="text-xs text-slate-505 py-6 text-center text-slate-500">No core skills cataloged yet for this user target.</p>
              ) : (
                <div className="space-y-4 pt-1">
                  
                  {/* Gaps Checklist */}
                  {remainingSkills.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-[9px] font-bold text-rose-400 uppercase tracking-widest font-mono">Missing Skill Gaps ({remainingSkills.length})</span>
                      <div className="space-y-1.5 max-h-56 overflow-y-auto custom-scrollbar pr-1">
                        {remainingSkills.map((sk) => (
                          <div 
                            key={sk.id}
                            className="flex items-center gap-3 p-2.5 bg-slate-950/35 hover:bg-slate-950/80 border border-slate-900 rounded-lg transition"
                          >
                            <input
                              type="checkbox"
                              checked={false}
                              disabled={toggleLoading === sk.id}
                              onChange={() => handleCheckboxClick(sk.id, false)}
                              className="w-4.5 h-4.5 rounded border-slate-800 bg-slate-900 text-indigo-600 focus:ring-0 cursor-pointer"
                            />
                            <div className="min-w-0 flex-1 flex justify-between items-center">
                              <span className="text-[11px] text-slate-300 font-medium truncate">{sk.skillName}</span>
                              {toggleLoading === sk.id && <Clock className="w-3.5 h-3.5 animate-spin text-slate-500" />}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Acquired Skills Checkbox */}
                  {completedSkills.length > 0 && (
                    <div className="space-y-2 pt-2">
                      <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest font-mono">Acquired Competencies ({completedSkills.length})</span>
                      <div className="space-y-1.5 max-h-56 overflow-y-auto custom-scrollbar pr-1">
                        {completedSkills.map((sk) => (
                          <div 
                            key={sk.id}
                            className="flex items-center gap-3 p-2.5 bg-slate-950/35 border border-slate-900/60 rounded-lg opacity-75"
                          >
                            <input
                              type="checkbox"
                              checked={true}
                              disabled={toggleLoading === sk.id}
                              onChange={() => handleCheckboxClick(sk.id, true)}
                              className="w-4.5 h-4.5 rounded border-slate-800 bg-slate-900 text-emerald-500 focus:ring-0 cursor-pointer"
                            />
                            <div className="min-w-0 flex-1 flex justify-between items-center">
                              <span className="text-[11px] text-slate-400 line-through truncate">{sk.skillName}</span>
                              {toggleLoading === sk.id && <Clock className="w-3.5 h-3.5 animate-spin text-slate-500" />}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                </div>
              )}
            </div>

            {/* SVG Interactive Chart Column */}
            <div className="lg:col-span-5 bg-slate-900/45 border border-slate-850 rounded-2xl p-5 flex flex-col justify-between">
              <div className="mb-4">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono text-indigo-400">Alignment Milestones</h3>
                <p className="text-[10px] text-slate-400 mt-1">Recalculating score indicators dynamically</p>
              </div>

              {/* Hand-crafted Area Chart Graph inside SVG */}
              <div className="h-44 w-full bg-slate-950/55 rounded-xl border border-slate-900 p-3 flex flex-col justify-end relative">
                
                {/* Horizontal grid guide lines */}
                <div className="absolute inset-x-3 top-6 h-px bg-slate-900" />
                <div className="absolute inset-x-3 top-18 h-px bg-slate-905 bg-slate-900/60" />
                <div className="absolute inset-x-3 top-30 h-px bg-slate-900/20" />

                {/* Score indicators */}
                <div className="absolute left-4 top-2 text-[8px] font-mono text-slate-600">Max Cap: 100%</div>

                <svg className="w-full h-28 overflow-visible">
                  {/* Solid area path beneath line */}
                  <path
                    d={`M 15 110 
                        L 15 ${110 - chartData[0].score} 
                        L 90 ${110 - chartData[1].score} 
                        L 165 ${110 - chartData[2].score} 
                        L 240 ${110 - chartData[3].score} 
                        L 240 110 Z`}
                    fill="url(#area-gradient)"
                    className="transition-all duration-500"
                  />
                  {/* Main plot line */}
                  <path
                    d={`M 15 ${110 - chartData[0].score} 
                        L 90 ${110 - chartData[1].score} 
                        L 165 ${110 - chartData[2].score} 
                        L 240 ${110 - chartData[3].score}`}
                    fill="none"
                    stroke="rgb(99, 102, 241)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    className="transition-all duration-500"
                  />
                  
                  {/* Nodes circles */}
                  <circle cx="15" cy={110 - chartData[0].score} r="4" fill="rgb(99, 102, 241)" className="transition-all duration-500" />
                  <circle cx="90" cy={110 - chartData[1].score} r="4" fill="rgb(99, 102, 241)" className="transition-all duration-500" />
                  <circle cx="165" cy={110 - chartData[2].score} r="4" fill="rgb(99, 102, 241)" className="transition-all duration-500" />
                  <circle cx="240" cy={110 - chartData[3].score} r="5" fill="rgb(244, 63, 94)" className="transition-all duration-500" />

                  {/* Gradient definitions */}
                  <defs>
                    <linearGradient id="area-gradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="rgba(99, 102, 241, 0.25)" />
                      <stop offset="100%" stopColor="rgba(99, 102, 241, 0)" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* X Axis Labels */}
                <div className="flex justify-between text-[9px] text-slate-500 font-mono pt-2 border-t border-slate-900 mt-2 px-1">
                  <span>{chartData[0].label} ({chartData[0].score}%)</span>
                  <span>{chartData[1].label} ({chartData[1].score}%)</span>
                  <span>{chartData[2].label} ({chartData[2].score}%)</span>
                  <span className="text-rose-400 font-semibold">{chartData[3].label} ({chartData[3].score}%)</span>
                </div>
              </div>

              {/* Suggestions quick box */}
              <div className="mt-4 p-3 bg-indigo-950/20 border border-indigo-900/40 rounded-xl flex items-start gap-2.5">
                <HelpCircle className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <p className="text-[10px] text-slate-400 leading-normal">
                  <span className="text-white font-semibold block mb-0.5">Quick Accelerator Tip:</span>
                  Toggling remaining checkboxes will recalculate your target readiness immediately. Once readiness achieves <span className="text-indigo-400 font-semibold">65%</span>, you unlock core credentials!
                </p>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
