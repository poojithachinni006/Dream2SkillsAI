/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  Sparkles, 
  CheckCircle, 
  CheckSquare, 
  Square,
  AlertCircle,
  Award,
  BookOpen
} from 'lucide-react';
import { StudyPlan, StudyPlanWeek, StudyPlanDay } from '../types';

interface StudyPlannerProps {
  careerGoal: string;
  onRefreshDashboard: () => Promise<void>;
}

export default function StudyPlanner({ careerGoal, onRefreshDashboard }: StudyPlannerProps) {
  const [hoursPerDay, setHoursPerDay] = useState(2);
  const [targetDate, setTargetDate] = useState('2026-07-01');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [plan, setPlan] = useState<StudyPlan | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!careerGoal) {
      setError('Please map a target Career Goal first on the Explorer or Analyzer tabs prior to scheduling study timetables.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/study-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          career: careerGoal,
          hoursPerDay: hoursPerDay,
          targetDate: targetDate
        }),
      });

      if (!response.ok) {
        throw new Error('Could not compile study plan.');
      }

      const data = await response.json();
      setPlan(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error occurred connecting with Gemini scheduler.');
    } finally {
      setLoading(false);
    }
  };

  const toggleDayCompletion = (weekIndex: number, dayIndex: number) => {
    if (!plan) return;
    const updatedPlan = { ...plan };
    const day = updatedPlan.weeks[weekIndex].days[dayIndex];
    day.completed = !day.completed;
    setPlan(updatedPlan);
  };

  return (
    <div className="flex-1 p-6 overflow-y-auto bg-slate-950 text-slate-100 min-h-screen">
      {/* Header */}
      <div className="pb-6 border-b border-slate-900 mb-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Calendar className="w-5 h-5 text-indigo-500" />
          <span>My Micro Study Planner</span>
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Organize daily learning timetables. Allocate core study hours and let AI split topics into manageable daily targets.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-6xl mx-auto">
        {/* Left Control Panel */}
        <div className="lg:col-span-4 bg-slate-900/50 p-5 rounded-2xl border border-slate-850 shadow-xl h-fit">
          <span className="text-xs font-bold text-white uppercase tracking-wider font-mono text-indigo-400 block mb-4">Timetable configuration</span>

          <form onSubmit={handleGenerate} className="space-y-5">
            {/* Display Active Goal */}
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-850">
              <span className="text-[9px] uppercase tracking-wider text-slate-500 font-bold font-mono block">Scheduling For Target Goal:</span>
              <span className="text-xs font-extrabold text-white leading-loose block mt-0.5">{careerGoal || 'No Career selected yet'}</span>
            </div>

            {/* Hours per day select */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-wider text-slate-400 font-bold font-mono">Daily Study Allocation</label>
              <select
                value={hoursPerDay}
                onChange={(e) => setHoursPerDay(Number(e.target.value))}
                className="w-full text-xs p-3 bg-slate-950 border border-slate-850 rounded-xl text-white focus:outline-none focus:border-indigo-600 transition cursor-pointer"
              >
                <option value={1}>1 Hour per day</option>
                <option value={2}>2 Hours per day</option>
                <option value={3}>3 Hours per day</option>
                <option value={4}>4+ Hours intensive study</option>
              </select>
            </div>

            {/* Target objective deadline */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-wider text-slate-400 font-bold font-mono">Target Completion Deadline</label>
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full text-xs p-3 bg-slate-950 border border-slate-850 rounded-xl text-white focus:outline-none focus:border-indigo-600 transition"
              />
            </div>

            {error && (
              <div className="p-3 bg-rose-950/40 border border-rose-955 border-rose-900/50 rounded-xl flex items-start gap-2 text-rose-400 text-[10px] leading-snug">
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
                  <span>Structuring schedule...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate AI Learning Schedule</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Schedule Output area */}
        <div className="lg:col-span-8">
          {loading && (
            <div className="p-8 bg-slate-900/40 border border-slate-900 rounded-2xl text-center space-y-4 max-w-md mx-auto">
              <div className="w-10 h-10 rounded-full bg-indigo-950 text-indigo-400 flex items-center justify-center mx-auto">
                <Calendar className="w-5 h-5 animate-bounce" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-semibold text-white">Partitioning Syllabus calendar...</h4>
                <p className="text-[10px] text-slate-500 leading-relaxed">
                  Structuring day-by-day courses relative to user goals. Allocating optimal hour levels to avoid learning fatigue.
                </p>
              </div>
            </div>
          )}

          {!loading && !plan && (
            <div className="p-8 bg-slate-900/30 border border-slate-900 rounded-2xl text-center text-slate-500 h-80 flex flex-col justify-center items-center max-w-md mx-auto mt-6">
              <Calendar className="w-12 h-12 text-slate-600 mb-3 animate-pulse" />
              <h4 className="text-xs font-semibold text-white">Dynamic Study Timetabler</h4>
              <p className="text-[10px] mt-1.5 leading-relaxed">
                Fill the configuration panel on the left and submit to compose a day-by-day learning schedule customized exactly for your dream trajectory.
              </p>
            </div>
          )}

          {/* Render Active Study Calendar */}
          {plan && !loading && (
            <div className="space-y-6">
              <div className="p-4 bg-slate-900/40 border border-slate-850 rounded-2xl md:flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-indigo-950 text-indigo-400 text-[10px] font-mono rounded font-medium">
                    <CheckCircle className="w-3 h-3 text-indigo-400" />
                    <span>TIMETABLE ACTIVE</span>
                  </div>
                  <h3 className="text-xs font-extrabold text-white">Dynamic Study Grid: {plan.career}</h3>
                  <p className="text-[10px] text-slate-400 leading-normal">Interactive checklist items below. Toggle days to mark completion levels.</p>
                </div>
                <div className="text-right mt-3 md:mt-0">
                  <span className="text-[10px] text-slate-500 font-mono block">Deadline set:</span>
                  <span className="text-xs font-extrabold text-white font-mono">{plan.targetDate}</span>
                </div>
              </div>

              {/* Loop weeks */}
              {plan.weeks.map((week, wIdx) => (
                <div key={wIdx} className="bg-slate-900/40 border border-slate-850 rounded-2xl p-5 space-y-4">
                  {/* Week Metadata Title */}
                  <div className="flex justify-between items-start pb-3 border-b border-slate-950">
                    <div>
                      <span className="text-[9px] font-mono font-bold text-indigo-400 tracking-wider">WEEK {week.weekNumber} CHECKPOINT</span>
                      <h4 className="text-xs font-extrabold text-white mt-0.5">{week.focus}</h4>
                    </div>
                  </div>

                  {/* Day items lists */}
                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                    {week.days.map((day, dIdx) => (
                      <div
                        key={dIdx}
                        onClick={() => toggleDayCompletion(wIdx, dIdx)}
                        className={`p-3 rounded-xl border transition-all duration-150 cursor-pointer flex flex-col justify-between min-h-32 ${
                          day.completed
                            ? 'bg-emerald-950/15 border-emerald-900/60 shadow-sm'
                            : 'bg-slate-950 border-slate-900 hover:border-slate-800'
                        }`}
                      >
                        <div>
                          <div className="flex justify-between items-start">
                            <span className="text-[9px] font-mono font-bold text-slate-500">{day.dayName}</span>
                            {day.completed ? (
                              <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            ) : (
                              <div className="w-3.5 h-3.5 rounded border border-slate-700 hover:border-slate-500" />
                            )}
                          </div>
                          <p className={`text-[10px] leading-snug mt-2 ${day.completed ? 'text-slate-500 line-through' : 'text-slate-300'}`}>
                            {day.topic}
                          </p>
                        </div>

                        <span className="text-[9px] font-mono text-slate-500 flex items-center gap-1 mt-3">
                          <Clock className="w-3 h-3 text-indigo-400" />
                          <span>{day.hours} hr study</span>
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Milestones for the Week */}
                  {week.milestones && (
                    <div className="pt-3.5 border-t border-slate-950 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {week.milestones.map((mi, idx) => (
                        <div key={idx} className="flex gap-2.5 p-2.5 bg-slate-955 rounded-xl border border-slate-950 text-[10px] text-slate-400 leading-snug items-start">
                          <Award className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                          <span>{mi}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
