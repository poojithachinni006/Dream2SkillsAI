/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle,
  TrendingUp, 
  Map, 
  Users, 
  BookOpen, 
  Award,
  ChevronRight,
  UserCheck
} from 'lucide-react';

interface HomeProps {
  onStartExploring: () => void;
  onStartAnalyzing: () => void;
  onOpenLogin: () => void;
  isLoggedIn: boolean;
}

export default function Home({ onStartExploring, onStartAnalyzing, onOpenLogin, isLoggedIn }: HomeProps) {
  const categories = [
    { name: 'Artificial Intelligence', count: '3 Careers', desc: 'AI Engineer, Machine Learning Engineer, NLP' },
    { name: 'Data Engineering & Science', count: '2 Careers', desc: 'Data Scientist, Advanced Data Analyst' },
    { name: 'Security & Cloud DevOps', count: '3 Careers', desc: 'Cybersecurity Analyst, DevOps & Cloud Engineers' },
    { name: 'Software Development', count: '1 Career', desc: 'Full Stack Web Platform Developer' },
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-slate-950 text-slate-100 min-h-screen">
      {/* Glow Ambient Effect */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-violet-600/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-6 pt-16 pb-12 text-center md:text-left md:flex items-center gap-12">
        <div className="flex-1 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-950/60 border border-indigo-800/80 rounded-full text-xs text-indigo-400 font-medium">
            <Sparkles className="w-3.5 h-3.5 animate-bounce" />
            <span>AI-Driven Professional Acceleration</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white leading-tight">
            Turn Your <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-300 bg-clip-text text-transparent">Dream Career</span> Into an Actionable Learning Roadmap
          </h1>
          
          <p className="text-slate-400 text-sm md:text-lg max-w-2xl leading-relaxed">
            Dream2Skills AI analyzes real-time industry skill gaps, writes customized path roadmaps, organizes daily study calendars, refines resumes, and matches suitable tech internships.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <button
              onClick={onStartAnalyzing}
              className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-500 hover:shadow-indigo-500/20 text-white rounded-xl text-sm font-semibold transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer shadow-lg"
            >
              <span>Analyze Skill Gaps</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onStartExploring}
              className="px-6 py-3.5 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 rounded-xl text-sm font-semibold transition duration-150 flex items-center justify-center gap-1 cursor-pointer"
            >
              <span>Explore Roles Catalogue</span>
              <ChevronRight className="w-4 h-4 text-slate-500" />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-6 pt-4 border-t border-slate-900">
            <div>
              <p className="text-2xl md:text-3xl font-extrabold text-white">98%</p>
              <p className="text-xs text-slate-500 uppercase tracking-widest font-mono mt-1">Accuracy Factor</p>
            </div>
            <div>
              <p className="text-2xl md:text-3xl font-extrabold text-white">100+</p>
              <p className="text-xs text-slate-500 uppercase tracking-widest font-mono mt-1">AI Projects</p>
            </div>
            <div>
              <p className="text-2xl md:text-3xl font-extrabold text-white">8</p>
              <p className="text-xs text-slate-500 uppercase tracking-widest font-mono mt-1">SaaS Sectors</p>
            </div>
          </div>
        </div>

        {/* Feature Visual Grid */}
        <div className="flex-1 mt-12 md:mt-0 max-w-md mx-auto">
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 shadow-2xl backdrop-blur-sm relative">
            <div className="absolute -top-3 -right-3 w-12 h-12 bg-indigo-500/10 rounded-full blur-xl animate-pulse" />
            <h3 className="text-sm font-semibold text-white tracking-wide uppercase font-mono text-indigo-400 mb-4">Core Ecosystem Elements</h3>
            
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-950 font-mono text-indigo-400 flex items-center justify-center shrink-0">1</div>
                <div>
                  <h4 className="text-xs font-semibold text-white">Evaluate Baseline Gaps</h4>
                  <p className="text-[11px] text-slate-400">Discover precise missing industry competencies compared to standard roles.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-950 font-mono text-indigo-400 flex items-center justify-center shrink-0">2</div>
                <div>
                  <h4 className="text-xs font-semibold text-white">Personalize Structured Path</h4>
                  <p className="text-[11px] text-slate-400">Receive 3-phase milestones detailing exact portfolios, APIs, and resources.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-950 font-mono text-indigo-400 flex items-center justify-center shrink-0">3</div>
                <div>
                  <h4 className="text-xs font-semibold text-white">Micro-Study Timetables</h4>
                  <p className="text-[11px] text-slate-400">Divide learning hours into day-by-day checkbox actions and targets.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-950 font-mono text-indigo-400 flex items-center justify-center shrink-0">4</div>
                <div>
                  <h4 className="text-xs font-semibold text-white">Simulate Q&A Panels</h4>
                  <p className="text-[11px] text-slate-400">Practice Technical, Coding and HR scenarios with expert AI hints.</p>
                </div>
              </div>
            </div>

            {!isLoggedIn && (
              <button 
                onClick={onOpenLogin}
                className="mt-6 w-full py-2.5 bg-slate-800 hover:bg-slate-700/80 rounded-lg text-xs text-white font-medium flex items-center justify-center gap-2 cursor-pointer transition border border-slate-700/65"
              >
                <UserCheck className="w-4 h-4 text-indigo-400" />
                <span>Sign in to persist your progress</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Categories Review Row */}
      <div className="max-w-6xl mx-auto px-6 py-12 border-t border-slate-900">
        <h2 className="text-lg font-bold text-white mb-6">High-Yield Technical Categories Supported</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((cat, i) => (
            <div 
              key={i}
              className="p-5 bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800/80 hover:border-slate-700 rounded-xl transition duration-150"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xs font-bold text-slate-200 truncate pr-2">{cat.name}</h3>
                <span className="text-[9px] font-mono bg-indigo-950/80 text-indigo-400 px-2 py-0.5 rounded border border-indigo-900 shrink-0 font-semibold">{cat.count}</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">{cat.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Feature Focus Banners */}
      <div className="max-w-6xl mx-auto px-6 pb-20 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-6 bg-slate-900/30 rounded-xl border border-slate-900 flex gap-4">
          <div className="w-10 h-10 rounded-lg bg-indigo-950 text-indigo-400 flex items-center justify-center shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white mb-1">ATS Optimization</h3>
            <p className="text-[11px] text-slate-400 leading-relaxed">Check keyword overlap matrices and scoring dynamics tailored strictly for system parsers.</p>
          </div>
        </div>

        <div className="p-6 bg-slate-900/30 rounded-xl border border-slate-900 flex gap-4">
          <div className="w-10 h-10 rounded-lg bg-indigo-950 text-indigo-400 flex items-center justify-center shrink-0">
            <Map className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white mb-1">Three-Tier Portfolios</h3>
            <p className="text-[11px] text-slate-400 leading-relaxed">Ditch theoretical slides. Build real structural open-source projects recommended by the model.</p>
          </div>
        </div>

        <div className="p-6 bg-slate-900/30 rounded-xl border border-slate-900 flex gap-4">
          <div className="w-10 h-10 rounded-lg bg-indigo-950 text-indigo-400 flex items-center justify-center shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white mb-1">Mentoring Backchannel</h3>
            <p className="text-[11px] text-slate-400 leading-relaxed">Ask your personal AI copilot questions about certifications, salary negotiations, or frameworks.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
