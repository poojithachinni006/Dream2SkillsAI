/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Mic, 
  Sparkles, 
  HelpCircle, 
  CheckCircle, 
  Eye, 
  EyeOff, 
  Award, 
  Clock, 
  AlertCircle 
} from 'lucide-react';
import { InterviewQuestion } from '../types';

interface InterviewSimulatorProps {
  careerGoal: string;
}

export default function InterviewSimulator({ careerGoal }: InterviewSimulatorProps) {
  const [targetCareer, setTargetCareer] = useState(careerGoal || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [revealedAnswers, setRevealedAnswers] = useState<Record<string, boolean>>({});

  React.useEffect(() => {
    if (careerGoal) {
      setTargetCareer(careerGoal);
    }
  }, [careerGoal]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetCareer.trim()) {
      setError('Please choose a valid dream career target.');
      return;
    }
    setError('');
    setLoading(true);
    setQuestions([]);
    setRevealedAnswers({});

    try {
      const response = await fetch('/api/interview-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ career: targetCareer }),
      });

      if (!response.ok) {
        throw new Error('Failed to compile practice questions.');
      }

      const data = await response.json();
      setQuestions(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error occurred generating interview guidelines.');
    } finally {
      setLoading(false);
    }
  };

  const toggleAnswer = (qId: string) => {
    setRevealedAnswers((prev) => ({
      ...prev,
      [qId]: !prev[qId]
    }));
  };

  return (
    <div className="flex-1 p-6 overflow-y-auto bg-slate-950 text-slate-100 min-h-screen">
      {/* Header */}
      <div className="pb-6 border-b border-slate-900 mb-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Mic className="w-5 h-5 text-indigo-500" />
          <span>AI Interview Preparation Simulator</span>
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Simulate realistic hiring interviews for your target dream role. Generate current Technical, Coding, and HR questions with custom advisor guidelines.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-6xl mx-auto">
        {/* Left Form config controls */}
        <div className="lg:col-span-4 bg-slate-900/50 p-5 rounded-2xl border border-slate-850 shadow-xl h-fit">
          <span className="text-xs font-bold text-white uppercase tracking-wider font-mono text-indigo-400 block mb-4">Question Setup</span>

          <form onSubmit={handleGenerate} className="space-y-4">
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-850">
              <span className="text-[9px] uppercase tracking-wider text-slate-500 font-bold font-mono block font-semibold">Active Goal target:</span>
              <span className="text-xs font-extrabold text-white block leading-loose mt-0.5">{careerGoal || 'No Focus selected yet'}</span>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-wider text-slate-400 font-bold font-mono">Target Role Trajectory</label>
              <input
                type="text"
                placeholder="e.g. AI Engineer, Data Scientist"
                value={targetCareer}
                onChange={(e) => setTargetCareer(e.target.value)}
                className="w-full text-xs p-3 bg-slate-950 border border-slate-850 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-indigo-600 transition"
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
                  <span>Prompting Gemini Engine...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Compile Custom Study Questions</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Questions Output area */}
        <div className="lg:col-span-8">
          {loading && (
            <div className="p-8 bg-slate-900/40 border border-slate-900 rounded-2xl text-center space-y-4 max-w-sm mx-auto mt-6">
              <div className="w-10 h-10 rounded-full bg-indigo-950 text-indigo-400 flex items-center justify-center mx-auto">
                <Mic className="w-5 h-5 animate-pulse" />
              </div>
              <div className="space-y-1.5">
                <h4 className="text-xs font-semibold text-white">Drafting custom core questions...</h4>
                <p className="text-[10px] text-slate-500 leading-normal">
                  Our LLM compiles core questions representing coding, team boundaries, and engineering architectures tailored precisely to your trajectory.
                </p>
              </div>
            </div>
          )}

          {!loading && questions.length === 0 && (
            <div className="p-8 bg-slate-900/30 border border-slate-900 rounded-2xl text-center text-slate-500 h-80 flex flex-col justify-center items-center max-w-md mx-auto mt-6">
              <Mic className="w-12 h-12 text-slate-600 mb-3" />
              <h4 className="text-xs font-semibold text-white">Interactive Hiring Simulator</h4>
              <p className="text-[10px] mt-1.5 leading-relaxed">
                Click Compile in the control panel to generate tailored, high-impact practice questions, and reveal full architectural answers once analyzed.
              </p>
            </div>
          )}

          {/* Render compiled Questions list */}
          {questions.length > 0 && !loading && (
            <div className="space-y-5">
              {questions.map((q, idx) => {
                const isRevealed = !!revealedAnswers[q.id];
                return (
                  <div key={q.id || idx} className="bg-slate-900/40 border border-slate-850 rounded-2xl p-5 space-y-4 relative">
                    
                    {/* Header Tags */}
                    <div className="flex justify-between items-start">
                      <span className={`text-[9px] font-mono font-bold tracking-widest px-2 py-0.5 rounded border ${
                        q.type === 'HR' 
                          ? 'bg-emerald-950/85 text-emerald-400 border-emerald-900/50' 
                          : q.type === 'Coding'
                          ? 'bg-amber-950/85 text-amber-400 border-amber-900/50'
                          : 'bg-indigo-950/85 text-indigo-400 border-indigo-900/50'
                      }`}>
                        {q.type.toUpperCase()} SPECIFICATION
                      </span>
                      <span className="text-[10px] font-mono text-slate-550 text-slate-500">Q-{idx + 1}</span>
                    </div>

                    {/* Question description */}
                    <h3 className="text-xs font-medium text-slate-200 leading-relaxed pr-2">
                      {q.question}
                    </h3>

                    <div className="flex gap-3.5 pt-1">
                      {/* Accordion Trigger */}
                      <button
                        onClick={() => toggleAnswer(q.id)}
                        className="py-1.5 px-3 bg-slate-950 hover:bg-slate-905 bg-slate-950/60 text-slate-300 rounded-lg text-[10px] font-bold border border-slate-850 hover:text-white flex items-center gap-1.5 cursor-pointer leading-none"
                      >
                        {isRevealed ? (
                          <>
                            <EyeOff className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                            <span>Hide Answer Outline</span>
                          </>
                        ) : (
                          <>
                            <Eye className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                            <span>Reveal Exemplary Answer</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Hidden Exemplary answer block */}
                    {isRevealed && (
                      <div className="p-3 bg-slate-950/70 border border-slate-900 rounded-xl space-y-1.5 transition-all duration-300">
                        <span className="text-[9px] font-mono uppercase tracking-widest text-emerald-400 font-bold block">Model Answer Outline</span>
                        <p className="text-[11px] text-slate-350 leading-relaxed font-sans">{q.sampleAnswer}</p>
                      </div>
                    )}

                    {/* Professional Advisor Guidance */}
                    {q.guidance && (
                      <div className="p-3.5 bg-indigo-950/15 border border-indigo-950/50 rounded-xl flex items-start gap-2.5">
                        <Award className="w-4.5 h-4.5 text-indigo-500 shrink-0 mt-0.5" />
                        <p className="text-[10px] text-slate-400 leading-relaxed">
                          <span className="text-slate-200 font-bold block mb-1">Advisor Preparation Tip:</span>
                          {q.guidance}
                        </p>
                      </div>
                    )}

                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
