/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  FileText, 
  Upload, 
  Sparkles, 
  AlertCircle, 
  CheckCircle, 
  Activity, 
  ArrowRight,
  TrendingUp,
  FileCheck2,
  Clock,
  ListRestart
} from 'lucide-react';
import { ResumeAnalysis } from '../types';

interface ResumeReviewerProps {
  careerGoal: string;
}

export default function ResumeReviewer({ careerGoal }: ResumeReviewerProps) {
  const [targetCareer, setTargetCareer] = useState(careerGoal || '');
  const [resumeText, setResumeText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [results, setResults] = useState<ResumeAnalysis | null>(null);

  // Simulated PDF load state
  const [fileName, setFileName] = useState('');
  const [uploadMocking, setUploadMocking] = useState(false);

  React.useEffect(() => {
    if (careerGoal) {
      setTargetCareer(careerGoal);
    }
  }, [careerGoal]);

  const handleMockUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setUploadMocking(true);

    // Simulate standard document extraction
    setTimeout(() => {
      const generatedMockText = `
      Name: Aspiring Candidate
      Contact: candidate@email.com
      Skills: HTML, JavaScript, Cascading Style Sheets, SQL, Git, Basic REST APIs, Python Programming, Node.js development, Agile.
      Experience:
      Software Associate - NextGen Web Corp
      - Designed modular system components safely.
      - Developed simple back-end Express endpoints.
      - Worked alongside QA testing groups to trace bug benchmarks.
      Education:
      BS in Information Technology - State Tech College (2025)
      `;
      setResumeText(generatedMockText.trim());
      setUploadMocking(false);
    }, 1200);
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetCareer.trim()) {
      setError('Please specify a target dream role.');
      return;
    }
    if (!resumeText.trim()) {
      setError('Please enter or upload your resume contents first.');
      return;
    }
    setError('');
    setLoading(true);
    setResults(null);

    try {
      const response = await fetch('/api/resume-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetCareer: targetCareer,
          resumeText: resumeText
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to audit resume specifications.');
      }

      const data = await response.json();
      setResults(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error occurred auditing resume.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 p-6 overflow-y-auto bg-slate-950 text-slate-100 min-h-screen">
      {/* Header */}
      <div className="pb-6 border-b border-slate-900 mb-6 font-sans">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <FileText className="w-5 h-5 text-indigo-500" />
          <span>Resume ATS Analyzer</span>
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Diagnose keyword matching percentages against specific industry roles, evaluate vocabulary grades and get resume improvements.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-6xl mx-auto">
        {/* Left Side Form */}
        <div className="lg:col-span-5 bg-slate-900/50 p-5 rounded-2xl border border-slate-850 shadow-xl h-fit space-y-4">
          <span className="text-xs font-bold text-white uppercase tracking-wider font-mono text-indigo-400 block pb-1 border-b border-slate-950">ATS Auditor Audit</span>

          <form onSubmit={handleAnalyze} className="space-y-4">
            {/* Target Career */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-wider text-slate-400 font-bold font-mono">Dream Role Focus</label>
              <input
                type="text"
                placeholder="e.g. AI Engineer, DevOps Engineer"
                value={targetCareer}
                onChange={(e) => setTargetCareer(e.target.value)}
                className="w-full text-xs p-3 bg-slate-950 border border-slate-850 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-indigo-600 transition"
                disabled={loading}
              />
            </div>

            {/* Simulated file upload or Drag and Drop */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-wider text-slate-400 font-bold font-mono">Upload PDF Resume File</label>
              <div className="border border-dashed border-slate-800 hover:border-slate-700 bg-slate-950/40 hover:bg-slate-950 rounded-xl p-4 text-center relative cursor-pointer group transition">
                <input
                  type="file"
                  accept=".pdf,.txt"
                  onChange={handleMockUpload}
                  className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10"
                  disabled={loading || uploadMocking}
                />
                <div className="space-y-2 pointer-events-none">
                  <Upload className="w-6 h-6 text-slate-500 group-hover:text-indigo-400 mx-auto transition" />
                  <div className="text-xs text-slate-400">
                    {uploadMocking ? (
                      <span className="text-indigo-400 animate-pulse font-mono">Parsing document elements...</span>
                    ) : fileName ? (
                      <span className="text-indigo-300 font-semibold">{fileName} attached</span>
                    ) : (
                      <span>Drag & drop resume PDF/File or click to browse</span>
                    )}
                  </div>
                  <p className="text-[9px] text-slate-600 font-mono">PDF & standard TXT files supported.</p>
                </div>
              </div>
            </div>

            {/* Resume Raw Text Box */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-[10px] uppercase tracking-wider text-slate-400 font-bold font-mono">
                <span>Resume Text Material</span>
                {resumeText && (
                  <button 
                    type="button" 
                    onClick={() => { setResumeText(''); setFileName(''); }}
                    className="text-slate-500 hover:text-rose-400 font-mono lowercase text-[9px] cursor-pointer"
                  >
                    [Clear]
                  </button>
                )}
              </div>
              <textarea
                placeholder="Paste your baseline resume summary, education benchmarks, and work experiences here..."
                rows={6}
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                className="w-full text-xs p-3 bg-slate-950 border border-slate-850 rounded-xl text-white placeholder-slate-650 focus:outline-none focus:border-indigo-600 transition resize-none custom-scrollbar"
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
              disabled={loading || uploadMocking}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/10 flex items-center justify-center gap-2 cursor-pointer transition disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Clock className="w-4 h-4 animate-spin" />
                  <span>Auditing matching keywords...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Analyze Resume ATS Alignment</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Side Audits Output */}
        <div className="lg:col-span-7">
          {loading && (
            <div className="p-8 bg-slate-900/40 border border-slate-900 rounded-2xl text-center space-y-4 max-w-sm mx-auto mt-12">
              <div className="w-10 h-10 rounded-full bg-indigo-950 text-indigo-400 flex items-center justify-center mx-auto">
                <Activity className="w-5 h-5 animate-spin" />
              </div>
              <div className="space-y-1.5">
                <h4 className="text-xs font-semibold text-white">Generating layout scoring cards...</h4>
                <p className="text-[10px] text-slate-500 leading-normal">
                  Matching parsed metrics against target required skills lists. Formulating improvement bullets and recommendations.
                </p>
              </div>
            </div>
          )}

          {!results && !loading && (
            <div className="p-8 bg-slate-900/30 border border-slate-900 rounded-2xl text-center text-slate-500 h-80 flex flex-col justify-center items-center max-w-md mx-auto mt-6">
              <FileCheck2 className="w-12 h-12 text-slate-600 mb-3 animate-pulse" />
              <h4 className="text-xs font-semibold text-white">Full-Stack Resume Reviewer</h4>
              <p className="text-[10px] mt-1.5 leading-relaxed">
                Unlock ATS audits! Paste your CV details or simulated upload, pick the career trajectory, and evaluate candidate score gaps instantly.
              </p>
            </div>
          )}

          {/* Review audits results */}
          {results && !loading && (
            <div className="space-y-6">
              {/* Score card indicators */}
              <div className="bg-slate-900/45 border border-slate-850 p-5 rounded-2xl grid grid-cols-2 gap-4">
                
                {/* ATS Keyword Score */}
                <div className="p-4 bg-slate-950/40 rounded-xl border border-slate-900 flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest font-bold block">ATS Keyword Score</span>
                    <span className="text-2xl font-extrabold text-white font-mono">{results.atsScore}%</span>
                    <span className="text-[9px] text-slate-500 block leading-none">Industry target density</span>
                  </div>

                  {/* Circle SVG */}
                  <div className="w-12 h-12 relative flex items-center justify-center scroll-none shrink-0">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="24" cy="24" r="19" className="stroke-slate-800" strokeWidth="3" fill="transparent" />
                      <circle cx="24" cy="24" r="19" className="stroke-indigo-500" strokeWidth="3.2" fill="transparent" strokeDasharray={2 * Math.PI * 19} strokeDashoffset={2 * Math.PI * 19 - (results.atsScore / 100) * (2 * Math.PI * 19)} />
                    </svg>
                    <span className="absolute text-[8px] font-bold text-white font-mono">{results.atsScore}%</span>
                  </div>
                </div>

                {/* Resume Quality Score */}
                <div className="p-4 bg-slate-950/40 rounded-xl border border-slate-900 flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest font-bold block">Layout Quality</span>
                    <span className="text-2xl font-extrabold text-white font-mono">{results.qualityScore}%</span>
                    <span className="text-[9px] text-slate-500 block leading-none">Readability grade score</span>
                  </div>

                  {/* Circle SVG */}
                  <div className="w-12 h-12 relative flex items-center justify-center scroll-none shrink-0">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="24" cy="24" r="19" className="stroke-slate-800" strokeWidth="3" fill="transparent" />
                      <circle cx="24" cy="24" r="19" className="stroke-indigo-400" strokeWidth="3.2" fill="transparent" strokeDasharray={2 * Math.PI * 19} strokeDashoffset={2 * Math.PI * 19 - (results.qualityScore / 100) * (2 * Math.PI * 19)} />
                    </svg>
                    <span className="absolute text-[8px] font-bold text-white font-mono">{results.qualityScore}%</span>
                  </div>
                </div>
              </div>

              {/* Matched vs Missing Splitted Columns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Matched Density */}
                <div className="p-4 bg-slate-900/40 border border-slate-850 rounded-xl space-y-2">
                  <span className="text-[9px] font-mono uppercase tracking-wider text-emerald-400 font-bold block">Keywords Mapped ({results.matchedSkills.length})</span>
                  <div className="flex flex-wrap gap-1">
                    {results.matchedSkills.length === 0 ? (
                      <span className="text-[10px] text-slate-600">None mapped. Include technical keywords matched to goals.</span>
                    ) : (
                      results.matchedSkills.map((s) => (
                        <span key={s} className="text-[9px] py-1 px-2 bg-emerald-950/20 text-emerald-400 rounded-md border border-emerald-950">
                          {s}
                        </span>
                      ))
                    )}
                  </div>
                </div>

                {/* Missing Density */}
                <div className="p-4 bg-slate-900/40 border border-slate-850 rounded-xl space-y-2">
                  <span className="text-[9px] font-mono uppercase tracking-wider text-rose-400 font-bold block">Missing Core KeyTerms ({results.missingSkills.length})</span>
                  <div className="flex flex-wrap gap-1">
                    {results.missingSkills.length === 0 ? (
                      <span className="text-[9px] text-slate-500">Perfect keyword optimization matched!</span>
                    ) : (
                      results.missingSkills.map((s) => (
                        <span key={s} className="text-[9px] py-1 px-2 bg-rose-950/20 text-rose-400 rounded-md border border-rose-950">
                          {s}
                        </span>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Suggestions items block */}
              <div className="p-5 bg-slate-900/40 border border-slate-850 rounded-2xl space-y-3">
                <span className="text-xs font-bold text-white uppercase tracking-wider font-mono text-indigo-400 block pb-1 border-b border-slate-950">ATS Redraft Suggestions</span>
                <ul className="space-y-3">
                  {results.improvementSuggestions.map((s, i) => (
                    <li key={i} className="flex gap-2.5 text-xs text-slate-400 leading-relaxed items-start">
                      <div className="w-5 h-5 rounded-full bg-slate-950 border border-slate-800 text-[10px] font-mono font-bold flex items-center justify-center shrink-0 text-slate-350">{i + 1}</div>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}
