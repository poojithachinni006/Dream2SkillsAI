/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Sliders, 
  Sparkles, 
  Map, 
  Award, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Layers, 
  Compass, 
  ChevronRight, 
  BookOpen, 
  Activity,
  Laptop,
  Play,
  Tv,
  ExternalLink,
  ArrowDown,
  HelpCircle
} from 'lucide-react';
import { RoadmapData } from '../types';

interface GapAnalyzerProps {
  prefilledCareer: string;
  onRefreshDashboard: () => Promise<void>;
}

export default function GapAnalyzer({ prefilledCareer, onRefreshDashboard }: GapAnalyzerProps) {
  const [career, setCareer] = useState('');
  const [currentSkills, setCurrentSkills] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Results State
  const [gapResults, setGapResults] = useState<{
    score: number;
    matchedSkills: string[];
    missingSkills: string[];
    recommendations: string[];
  } | null>(null);

  const [roadmap, setRoadmap] = useState<RoadmapData | null>(null);
  const [activePhase, setActivePhase] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [viewMode, setViewMode] = useState<'flowchart' | 'details'>('flowchart');

  // Load prefilled item immediately if clicked from explorer
  useEffect(() => {
    if (prefilledCareer) {
      setCareer(prefilledCareer);
    }
  }, [prefilledCareer]);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!career.trim()) {
      setError('Please specify a target career goal.');
      return;
    }
    setError('');
    setLoading(true);
    setGapResults(null);
    setRoadmap(null);

    try {
      // 1. Analyze Skill Gap
      const gapResponse = await fetch('/api/skill-gap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetCareer: career,
          currentSkills: currentSkills
        }),
      });

      if (!gapResponse.ok) {
        throw new Error('Could not evaluate skill gap. Specify a correct target career.');
      }

      const gapData = await gapResponse.json();
      setGapResults(gapData);

      // 2. Fetch/Generate personalized Roadmap
      const roadmapResponse = await fetch(`/api/roadmap/${encodeURIComponent(career)}`);
      if (roadmapResponse.ok) {
        const rData = await roadmapResponse.json();
        setRoadmap(rData);
      }

      // 3. Force dashboard refresh
      await onRefreshDashboard();

    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error occurred communicating with the AI Engine.');
    } finally {
      setLoading(false);
    }
  };

  const selectSuggestedPill = (suggestedCareer: string, initialSkills: string) => {
    setCareer(suggestedCareer);
    setCurrentSkills(initialSkills);
  };

  return (
    <div className="flex-1 p-6 overflow-y-auto bg-slate-950 text-slate-100 min-h-screen">
      {/* Header */}
      <div className="pb-6 border-b border-slate-900 mb-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Sliders className="w-5 h-5 text-indigo-500" />
          <span>Gap Analyzer & Roadmap Generator</span>
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Enter your current skills paired with your dream career. The model will analyze gaps, estimate readiness scores and plot 3-phase portfolio curriculums.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-6xl mx-auto">
        
        {/* Form panel Column */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-slate-900/60 border border-slate-850 p-5 rounded-2xl shadow-xl space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono text-indigo-400">Analysis Inputs</h3>

            <form onSubmit={handleAnalyze} className="space-y-4">
              {/* Target Career Goal */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-wider text-slate-400 font-bold font-mono">Dream Career Target</label>
                <input
                  type="text"
                  placeholder="e.g. AI Engineer, Product Manager"
                  className="w-full text-xs p-3 bg-slate-950 border border-slate-850 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-indigo-600 transition"
                  value={career}
                  onChange={(e) => setCareer(e.target.value)}
                  disabled={loading}
                />
              </div>

              {/* Current Skills list */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-wider text-slate-400 font-bold font-mono">My Existing Skills</label>
                <textarea
                  placeholder="e.g. Python, SQL, React, HTML, Git (separate with commas)"
                  rows={4}
                  className="w-full text-xs p-3 bg-slate-950 border border-slate-850 rounded-xl text-white placeholder-slate-605 focus:outline-none focus:border-indigo-600 transition resize-none custom-scrollbar"
                  value={currentSkills}
                  onChange={(e) => setCurrentSkills(e.target.value)}
                  disabled={loading}
                />
              </div>

              {error && (
                <div className="p-3 bg-rose-950/40 border border-rose-900/50 rounded-xl flex items-start gap-2 text-rose-400 text-[10px] leading-snug">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/10 flex items-center justify-center gap-2 cursor-pointer transition disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Clock className="w-4 h-4 animate-spin" />
                    <span>Compiling Gaps & Path...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Run Full AI Diagnostics</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Quick Select Pill suggestions */}
          <div className="p-4 bg-slate-900/30 border border-slate-900 rounded-xl space-y-2">
            <span className="text-[9px] uppercase tracking-wider text-slate-500 font-semibold font-mono block">Speed Fill Trajectories</span>
            <div className="space-y-1.5">
              <button
                onClick={() => selectSuggestedPill('AI Engineer', 'Python, SQL')}
                className="w-full text-left p-2 hover:bg-slate-900/80 rounded-lg text-[10px] text-slate-400 flex justify-between items-center transition"
              >
                <span>AI Engineer (with Python)</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
              </button>
              <button
                onClick={() => selectSuggestedPill('Full Stack Developer', 'React, JavaScript, HTML')}
                className="w-full text-left p-2 hover:bg-slate-900/80 rounded-lg text-[10px] text-slate-400 flex justify-between items-center transition"
              >
                <span>Full Stack (with React/JS)</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
              </button>
              <button
                onClick={() => selectSuggestedPill('DevOps Engineer', 'Linux, Docker, Git')}
                className="w-full text-left p-2 hover:bg-slate-900/80 rounded-lg text-[10px] text-slate-400 flex justify-between items-center transition"
              >
                <span>DevOps (with Linux/Docker)</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Results column Column */}
        <div className="lg:col-span-8">
          
          {loading && (
            /* Analysis loading state cards */
            <div className="p-8 bg-slate-900/40 border border-slate-900 rounded-2xl text-center space-y-4">
              <div className="w-10 h-10 rounded-full bg-indigo-950 text-indigo-400 flex items-center justify-center mx-auto">
                <Activity className="w-5 h-5 animate-spin" />
              </div>
              <div className="space-y-1.5 max-w-sm mx-auto">
                <p className="text-xs font-semibold text-white">Analyzing target career specifications...</p>
                <p className="text-[10px] text-slate-500 leading-normal">
                  Our Gemini LLM processes industry data, structures existing assets, extracts remaining missing core skills, and arranges project modules.
                </p>
              </div>
            </div>
          )}

          {!loading && !gapResults && !roadmap && (
            /* Introductory Onboarding Screen */
            <div className="p-8 bg-slate-900/30 border border-slate-900 rounded-2xl text-center text-slate-500 h-80 flex flex-col justify-center items-center max-w-md mx-auto mt-6">
              <Map className="w-12 h-12 text-slate-600 mb-3" />
              <h4 className="text-xs font-semibold text-white">Personalized Path Planner</h4>
              <p className="text-[10px] mt-1.5 leading-relaxed">
                Unlock active roadmaps! Define the dream career focus in the left input panel, compile, and see results here.
              </p>
            </div>
          )}

          {/* Render Results Diagnostics */}
          {gapResults && (
            <div className="space-y-6">
              {/* Readiness Score Card */}
              <div className="bg-slate-900/40 border border-slate-850 rounded-2xl p-5 md:flex items-center justify-between gap-6">
                <div className="space-y-1.5">
                  <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-indigo-950 text-indigo-400 text-[10px] font-mono rounded font-semibold">
                    <Activity className="w-3 h-3" />
                    <span>ALIGNMENT DIAGNOSTICS COMPLETE</span>
                  </div>
                  <h3 className="text-sm font-extrabold text-white">Ready Score Alignment for: {career}</h3>
                  <p className="text-[11px] text-slate-400 leading-relaxed max-w-md">
                    Check matched competencies vs critical missing elements. This diagnostic score is stored in your Dashboard.
                  </p>
                </div>

                <div className="mt-4 md:mt-0 flex gap-4 items-center shrink-0">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 font-mono block">Baseline Ready</span>
                    <span className="text-2xl font-extrabold text-white font-mono">{gapResults.score}%</span>
                  </div>
                  <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-red-500 to-indigo-500" style={{ width: `${gapResults.score}%` }} />
                  </div>
                </div>
              </div>

              {/* Matched vs Missing Splitted Columns */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Matched Skills Box */}
                <div className="bg-slate-900/3D bg-slate-900/45 border border-slate-850 p-4 rounded-xl space-y-3">
                  <span className="text-[9px] font-mono uppercase tracking-wider text-emerald-400 font-bold block">Matched Competencies Owned ({gapResults.matchedSkills.length})</span>
                  <div className="flex flex-wrap gap-1.5">
                    {gapResults.matchedSkills.length === 0 ? (
                      <span className="text-[10px] text-slate-600">None detected. Enter a list of skills in the input panel.</span>
                    ) : (
                      gapResults.matchedSkills.map((s) => (
                        <span key={s} className="text-[10px] font-medium py-1 px-2 bg-emerald-950/20 text-emerald-400 rounded border border-emerald-900/40">
                          {s}
                        </span>
                      ))
                    )}
                  </div>
                </div>

                {/* Missing Skills Box */}
                <div className="bg-slate-900/45 border border-slate-850 p-4 rounded-xl space-y-3">
                  <span className="text-[9px] font-mono uppercase tracking-wider text-rose-400 font-bold block">Actionable Missing Gaps ({gapResults.missingSkills.length})</span>
                  <div className="flex flex-wrap gap-1.5">
                    {gapResults.missingSkills.length === 0 ? (
                      <span className="text-[10px] text-slate-600">Perfect match! Gaps are fully covered.</span>
                    ) : (
                      gapResults.missingSkills.map((s) => (
                        <span key={s} className="text-[10px] font-medium py-1 px-2 bg-rose-950/20 text-rose-400 rounded border border-rose-900/40">
                          {s}
                        </span>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Suggestions bullets list */}
              {gapResults.recommendations && (
                <div className="p-4 bg-slate-900/30 border border-slate-900 rounded-xl space-y-2">
                  <span className="text-[9px] uppercase tracking-wider text-indigo-400 font-bold font-mono">AI Recommended Micro Steps</span>
                  <ul className="space-y-2">
                    {gapResults.recommendations.map((rec, idx) => (
                      <li key={idx} className="flex gap-2 text-xs text-slate-400 leading-normal">
                        <CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Render Roadmap Phases if present */}
          {roadmap && (
            <div className="mt-8 bg-slate-900/45 border border-slate-850 p-5 rounded-2xl shadow-xl space-y-6">
              
              {/* Header with Switcher Tabs */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-slate-950 font-sans">
                <div className="space-y-1">
                  <h3 className="text-sm font-extrabold text-white uppercase tracking-wider font-mono text-indigo-400 flex items-center gap-2">
                    <Map className="w-5 h-5 text-indigo-500 animate-pulse" />
                    <span>Dynamic Career Accelerator Roadmap</span>
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Interactive path-map structured to guide you step-by-step to perfect role competency.
                  </p>
                </div>

                {/* View Switcher Controls */}
                <div className="flex bg-slate-950/80 border border-slate-850 p-1 rounded-xl w-full md:w-auto shrink-0 justify-around font-sans">
                  <button
                    onClick={() => setViewMode('flowchart')}
                    className={`text-xs px-4 py-2 rounded-lg font-bold transition flex items-center gap-1.5 cursor-pointer ${
                      viewMode === 'flowchart'
                        ? 'bg-indigo-600 text-white shadow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    <span>🌟 End-to-End Flowchart</span>
                  </button>
                  <button
                    onClick={() => setViewMode('details')}
                    className={`text-xs px-4 py-2 rounded-lg font-bold transition flex items-center gap-1.5 cursor-pointer ${
                      viewMode === 'details'
                        ? 'bg-indigo-600 text-white shadow'
                        : 'text-slate-405 hover:text-white'
                    }`}
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>📋 Projects & Materials</span>
                  </button>
                </div>
              </div>

              {/* View Rendering Switcher */}
              {viewMode === 'flowchart' ? (
                /* CHRONOLOGICAL FLOW DIAGRAM */
                <div className="space-y-6 relative pl-3 border-l-2 border-indigo-900/60 ml-2 py-2">
                  <div className="absolute left-[-6px] top-0 w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                  <div className="absolute left-[-6px] top-0 w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  
                  {/* Timeline start badge */}
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950 border border-slate-855 text-[10px] font-mono tracking-wider text-emerald-400 font-extrabold shadow-sm">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                    <span>START OF ROADMAP TRAIL</span>
                  </div>

                  {/* 1. Beginner Phase Flow */}
                  <div className="space-y-4 pt-2">
                    {/* Phase Header Node */}
                    <div className="p-3 bg-gradient-to-r from-indigo-950/40 via-indigo-900/20 to-slate-900/20 border border-indigo-900/50 rounded-xl flex items-center justify-between gap-3 shadow-md shadow-indigo-950/20">
                      <div className="flex items-center gap-2.5 font-sans">
                        <div className="w-7 h-7 rounded-lg bg-indigo-600/25 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold font-mono text-xs">
                          1
                        </div>
                        <div>
                          <h4 className="text-xs font-extrabold text-white uppercase tracking-wider font-mono text-indigo-400">Step 1: Beginner Integration Phase</h4>
                          <p className="text-[10px] text-slate-400">Core foundational variables, operations, basic workspace configurations and tools.</p>
                        </div>
                      </div>
                      <span className="text-[9px] font-mono font-bold bg-indigo-950 px-2 py-0.5 border border-indigo-900/60 rounded-full text-indigo-400 whitespace-nowrap leading-none h-fit">
                        ⏱️ {roadmap.beginner.estimatedDuration}
                      </span>
                    </div>

                    {/* Beginner Topics chains */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pl-2">
                      {(roadmap.beginner.topics || []).map((topic, idx) => {
                        const searchQ = `${career} ${topic.name} course free tutorial youtube`;
                        const ytSearchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(searchQ)}`;
                        return (
                          <div key={idx} className="bg-slate-950/40 hover:bg-slate-950/85 border border-slate-850 hover:border-indigo-900/80 p-4 rounded-xl flex flex-col justify-between gap-4 transition group font-sans">
                            <div className="space-y-2">
                              <div className="flex items-center justify-between gap-2 border-b border-slate-900/50 pb-1.5 font-sans">
                                <span className="text-[9px] font-bold font-mono text-indigo-400 bg-indigo-950/40 px-1.5 py-0.5 rounded border border-indigo-900/20 uppercase font-bold text-indigo-400">
                                  Topic 1.{idx + 1}
                                </span>
                                <span className="text-[9px] text-slate-500 font-mono font-semibold">{topic.duration}</span>
                              </div>
                              <h5 className="text-xs font-bold text-white leading-tight group-hover:text-indigo-400 transition">{topic.name}</h5>
                              <p className="text-[10px] text-slate-405 leading-relaxed">{topic.description}</p>
                            </div>

                            {/* Youtube Search Button */}
                            <a
                              href={ytSearchUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[10px] py-1.5 px-3 bg-red-950/40 hover:bg-red-650 border border-red-900/65 hover:border-red-500 hover:text-white rounded-lg font-bold text-red-400 flex items-center justify-center gap-1.5 transition cursor-pointer decoration-none"
                            >
                              <Tv className="w-3.5 h-3.5 shrink-0" />
                              <span>Watch Course on YouTube</span>
                              <ExternalLink className="w-2.5 h-2.5 shrink-0 opacity-70" />
                            </a>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Connecting Line Pointing to Intermediate */}
                  <div className="py-2 flex items-center justify-center">
                    <div className="h-8 w-[1px] bg-gradient-to-b from-indigo-500 to-purple-500" />
                    <ArrowDown className="w-4 h-4 text-purple-400 animate-bounce mx-2 shrink-0" />
                    <span className="text-[9px] font-mono font-bold text-purple-400 uppercase tracking-widest bg-purple-950/40 px-2.5 py-0.5 rounded border border-purple-900/30">
                      Progressive Step-Up
                    </span>
                    <div className="h-8 w-[1px] bg-gradient-to-b from-purple-500 to-indigo-500" />
                  </div>

                  {/* 2. Intermediate Phase Flow */}
                  <div className="space-y-4">
                    {/* Phase Header Node */}
                    <div className="p-3 bg-gradient-to-r from-purple-950/40 via-purple-900/20 to-slate-900/20 border border-purple-900/50 rounded-xl flex items-center justify-between gap-3 shadow-md shadow-purple-950/20">
                      <div className="flex items-center gap-2.5 font-sans">
                        <div className="w-7 h-7 rounded-lg bg-purple-600/25 border border-purple-500/30 flex items-center justify-center text-purple-400 font-bold font-mono text-xs">
                          2
                        </div>
                        <div>
                          <h4 className="text-xs font-extrabold text-white uppercase tracking-wider font-mono text-purple-400">Step 2: Intermediate Integration Phase</h4>
                          <p className="text-[10px] text-slate-400">Database normalization, custom API endpoints, response structuring, and modular libraries.</p>
                        </div>
                      </div>
                      <span className="text-[9px] font-mono font-bold bg-purple-950 px-2 py-0.5 border border-purple-900/60 rounded-full text-purple-450 whitespace-nowrap leading-none h-fit">
                        ⏱️ {roadmap.intermediate.estimatedDuration}
                      </span>
                    </div>

                    {/* Intermediate Topics lists */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pl-2">
                      {(roadmap.intermediate.topics || []).map((topic, idx) => {
                        const searchQ = `${career} ${topic.name} tutorial crash course free youtube`;
                        const ytSearchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(searchQ)}`;
                        return (
                          <div key={idx} className="bg-slate-950/40 hover:bg-slate-950/85 border border-slate-850 hover:border-purple-900/80 p-4 rounded-xl flex flex-col justify-between gap-4 transition group font-sans">
                            <div className="space-y-2">
                              <div className="flex items-center justify-between gap-2 border-b border-slate-900/50 pb-1.5 font-sans">
                                <span className="text-[9px] font-bold font-mono text-purple-400 bg-purple-950/40 px-1.5 py-0.5 rounded border border-purple-900/20 uppercase font-bold text-purple-400">
                                  Topic 2.{idx + 1}
                                </span>
                                <span className="text-[9px] text-slate-500 font-mono font-semibold">{topic.duration}</span>
                              </div>
                              <h5 className="text-xs font-bold text-white leading-tight group-hover:text-purple-400 transition">{topic.name}</h5>
                              <p className="text-[10px] text-slate-405 leading-relaxed">{topic.description}</p>
                            </div>

                            {/* Youtube Search Button */}
                            <a
                              href={ytSearchUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[10px] py-1.5 px-3 bg-red-950/40 hover:bg-red-650 border border-red-900/60 hover:border-red-500 hover:text-white rounded-lg font-bold text-red-100 flex items-center justify-center gap-1.5 transition cursor-pointer decoration-none"
                            >
                              <Tv className="w-3.5 h-3.5 shrink-0" />
                              <span>Watch Course on YouTube</span>
                              <ExternalLink className="w-2.5 h-2.5 shrink-0 opacity-70" />
                            </a>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Connecting Line Pointing to Advanced */}
                  <div className="py-2 flex items-center justify-center">
                    <div className="h-8 w-[1px] bg-gradient-to-b from-purple-500 to-pink-500" />
                    <ArrowDown className="w-4 h-4 text-pink-400 animate-bounce mx-2 shrink-0" />
                    <span className="text-[9px] font-mono font-bold text-pink-400 uppercase tracking-widest bg-pink-950/40 px-2.5 py-0.5 rounded border border-pink-900/30 font-sans">
                      Mastery Threshold
                    </span>
                    <div className="h-8 w-[1px] bg-gradient-to-b from-pink-500 to-purple-500" />
                  </div>

                  {/* 3. Advanced Phase Flow */}
                  <div className="space-y-4">
                    {/* Phase Header Node */}
                    <div className="p-3 bg-gradient-to-r from-pink-950/40 via-pink-900/20 to-slate-900/20 border border-pink-900/50 rounded-xl flex items-center justify-between gap-3 shadow-md shadow-pink-950/20 font-sans font-sans">
                      <div className="flex items-center gap-2.5 font-sans">
                        <div className="w-7 h-7 rounded-lg bg-pink-600/25 border border-pink-500/30 flex items-center justify-center text-pink-400 font-bold font-mono text-xs font-sans">
                          3
                        </div>
                        <div>
                          <h4 className="text-xs font-extrabold text-white uppercase tracking-wider font-mono text-pink-400 font-sans">Step 3: Advanced Optimization & Scaling</h4>
                          <p className="text-[10px] text-slate-400 font-sans font-sans">Fault tolerance, load balancing, multi-tier database query plans, and secure gate pipelines.</p>
                        </div>
                      </div>
                      <span className="text-[9px] font-mono font-bold bg-pink-950 px-2 py-0.5 border border-pink-900/60 rounded-full text-pink-405 whitespace-nowrap leading-none h-fit font-sans">
                        ⏱️ {roadmap.advanced.estimatedDuration}
                      </span>
                    </div>

                    {/* Advanced Topics list */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pl-2">
                      {(roadmap.advanced.topics || []).map((topic, idx) => {
                        const searchQ = `${career} ${topic.name} course tutorials free youtube`;
                        const ytSearchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(searchQ)}`;
                        return (
                          <div key={idx} className="bg-slate-950/40 hover:bg-slate-950/85 border border-slate-850 hover:border-pink-900/80 p-4 rounded-xl flex flex-col justify-between gap-4 transition group font-sans">
                            <div className="space-y-2">
                              <div className="flex items-center justify-between gap-2 border-b border-slate-900/55 pb-1.5 font-sans">
                                <span className="text-[9px] font-bold font-mono text-pink-400 bg-pink-950/40 px-1.5 py-0.5 rounded border border-pink-900/20 uppercase font-bold text-pink-400 font-bold">
                                  Topic 3.{idx + 1}
                                </span>
                                <span className="text-[9px] text-slate-500 font-mono font-semibold">{topic.duration}</span>
                              </div>
                              <h5 className="text-xs font-bold text-white leading-tight group-hover:text-pink-400 transition">{topic.name}</h5>
                              <p className="text-[10px] text-slate-405 leading-relaxed">{topic.description}</p>
                            </div>

                            {/* Youtube Search Button */}
                            <a
                              href={ytSearchUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[10px] py-1.5 px-3 bg-red-950/40 hover:bg-red-650 border border-red-900/60 hover:border-red-500 hover:text-white rounded-lg font-bold text-red-10 flex items-center justify-center gap-1.5 transition cursor-pointer decoration-none"
                            >
                              <Tv className="w-3.5 h-3.5 shrink-0" />
                              <span>Watch Course on YouTube</span>
                              <ExternalLink className="w-2.5 h-2.5 shrink-0 opacity-70" />
                            </a>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Completion Medal badge */}
                  <div className="pt-4 flex flex-col items-start gap-2 border-t border-slate-900 font-sans">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-950/60 border border-emerald-900/50 rounded-xl text-xs font-extrabold text-emerald-400 shadow shadow-emerald-950/30">
                      <Award className="w-4 h-4 text-emerald-400" />
                      <span>{career.toUpperCase() || 'CAREER'} MASTERY ACHIEVED 👑</span>
                    </div>
                    <p className="text-[11px] text-slate-405 leading-normal max-w-2xl pl-1 font-sans">
                      Congratulations! Completing this sequential study track guarantees high readiness alignment. Click "Projects & Resources" view to inspect capstone structures and review other curated platforms checklist.
                    </p>
                  </div>
                </div>
              ) : (
                /* ORIGINAL DETAILED PROJECTS & MATS VIEW */
                <div className="space-y-6">
                  {/* Phase selector buttons inside the details view mode */}
                  <div className="flex items-center justify-between pb-2 border-b border-slate-900/60 font-sans">
                    <span className="text-[10px] font-bold text-slate-405 uppercase tracking-wider font-mono font-sans font-semibold">Exploring Phase: {activePhase.toUpperCase()} specifications</span>
                    <div className="flex gap-1 bg-slate-950 p-1 rounded-lg border border-slate-850">
                      {(['beginner', 'intermediate', 'advanced'] as const).map((ph) => {
                        const isActive = activePhase === ph;
                        return (
                          <button
                            key={ph}
                            onClick={() => setActivePhase(ph)}
                            className={`text-[9.5px] font-mono tracking-wide px-2.5 py-1 rounded cursor-pointer transition ${
                              isActive 
                                ? 'bg-indigo-600 text-white font-extrabold shadow-sm font-sans' 
                                : 'text-slate-400 hover:text-white hover:bg-slate-900/40'
                            }`}
                          >
                            {ph.toUpperCase()}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Target details render */}
                  {roadmap[activePhase] ? (
                    <div className="space-y-5">
                      <div className="flex justify-between items-center p-3 bg-slate-950/30 rounded-xl border border-slate-900/60 text-xs text-slate-400 leading-none">
                        <span className="font-semibold text-slate-300 capitalize font-sans">{activePhase} phase expected tracking:</span>
                        <span className="font-bold text-indigo-400 font-mono">{roadmap[activePhase].estimatedDuration}</span>
                      </div>

                      {/* Phase Skills list */}
                      <div className="space-y-2">
                        <span className="text-[9px] uppercase tracking-wider text-slate-500 font-extrabold font-mono block">Subskill sets To Verify</span>
                        <div className="flex flex-wrap gap-1.5 font-sans">
                          {roadmap[activePhase].skills.map((sk) => (
                            <span key={sk} className="text-[10px] bg-slate-950 py-1 px-2.5 text-slate-300 border border-slate-855 rounded-lg font-medium font-sans">
                              {sk}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Phase capstone projects */}
                      <div className="space-y-2 font-sans font-sans">
                        <span className="text-[9px] uppercase tracking-wider text-slate-500 font-extrabold font-mono block">Recommended Core Capstone project</span>
                        {roadmap[activePhase].projects.map((proj, idx) => (
                          <div key={idx} className="p-4 bg-slate-955 bg-slate-950/60 rounded-xl border border-indigo-950/40 space-y-3 font-sans">
                            <div className="flex justify-between items-start gap-2 max-w-full">
                              <div>
                                <h4 className="text-xs font-bold text-white flex items-center gap-1.5 leading-none font-sans font-sans">
                                  <Laptop className="w-3.5 h-3.5 text-indigo-400 shrink-0 font-sans" />
                                  <span>{proj.title}</span>
                                </h4>
                                <p className="text-[10px] text-slate-400 leading-normal mt-1.5 font-sans font-sans">{proj.description}</p>
                              </div>
                              <span className="text-[9px] font-mono font-bold uppercase py-0.5 px-2 bg-indigo-950 text-indigo-400 border border-indigo-900/60 rounded">
                                {proj.complexity}
                              </span>
                            </div>

                            <div className="flex flex-wrap gap-1 pt-1.5 border-t border-slate-900 font-sans">
                              {proj.features.map((feat) => (
                                <span key={feat} className="text-[9px] text-indigo-305 font-mono bg-slate-900/80 px-2 py-0.5 rounded border border-slate-855/60 font-semibold font-sans">
                                  {feat}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Curated Resources */}
                      <div className="space-y-2 font-sans font-sans font-sans">
                        <span className="text-[9px] uppercase tracking-wider text-slate-500 font-extrabold font-mono block">Curated Materials & Links Checklist</span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 font-sans font-sans">
                          {roadmap[activePhase].resources.map((res, idx) => (
                            <a
                              key={idx}
                              href={res.url}
                              target="_blank"
                              rel="noreferrer"
                              className="p-3 bg-slate-950/20 border border-slate-900 hover:border-slate-800 rounded-xl flex items-center justify-between gap-3 group transition decoration-none font-sans"
                            >
                              <div className="flex items-center gap-2 min-w-0 font-sans">
                                <BookOpen className="w-4 h-4 text-slate-500 shrink-0 group-hover:text-indigo-400 transition" />
                                <div className="min-w-0 font-sans">
                                  <span className="text-[11px] text-slate-300 group-hover:text-white font-medium truncate block leading-normal font-sans font-sans">{res.title}</span>
                                  <span className="text-[9px] font-mono text-slate-500 block mt-0.5 font-sans font-sans font-sans">{res.type} Reference</span>
                                </div>
                              </div>
                              <ChevronRight className="w-4 h-4 text-slate-700 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition" />
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-550 font-sans">Error rendering phase specs.</p>
                  )}
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
