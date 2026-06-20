/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  X, 
  HelpCircle, 
  Brain, 
  UserCheck, 
  CheckCircle, 
  AlertCircle,
  Clock,
  Briefcase
} from 'lucide-react';

// Models
import { User, CareerGoal, UserSkill } from './types';

// Sidebar Navigation
import Navigation from './components/Navigation';

// Modular Pages
import Home from './pages/Home';
import CareerExplorer from './pages/CareerExplorer';
import Dashboard from './pages/Dashboard';
import GapAnalyzer from './pages/GapAnalyzer';
import StudyPlanner from './pages/StudyPlanner';
import ResumeReviewer from './pages/ResumeReviewer';
import InterviewSimulator from './pages/InterviewSimulator';
import MentorChat from './pages/MentorChat';
import Internships from './pages/Internships';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [user, setUser] = useState<User | null>(null);
  const [goal, setGoal] = useState<CareerGoal | null>(null);
  const [skills, setSkills] = useState<UserSkill[]>([]);
  const [isAiOnline, setIsAiOnline] = useState(false);

  // Prefilled career selected from Explorer
  const [prefilledCareer, setPrefilledCareer] = useState('');

  // Login Modal Toggle
  const [loginOpen, setLoginOpen] = useState(false);
  const [authName, setAuthName] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const [authRole, setAuthRole] = useState('Aspiring Professional');
  const [authMessage, setAuthMessage] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // App loader
  const [appInit, setAppInit] = useState(true);

  // Reload statistics
  const syncSessionProfile = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const data = await response.json();
        if (data.authenticated) {
          setUser(data.user);
          setGoal(data.goal || null);
          setSkills(data.skills || []);
        } else {
          setUser(null);
          setGoal(null);
          setSkills([]);
        }
      }
    } catch (e) {
      console.warn('Sync connection notes:', e);
    } finally {
      setAppInit(false);
    }
  };

  // Run dynamic target check for Gemini API key status
  const diagnoseAiEngine = async () => {
    try {
      // Test the simple analyzer with empty contents or just checking mock
      const res = await fetch('/api/skill-gap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetCareer: 'test', currentSkills: 'test' }),
      });
      if (res.ok) {
        const data = await res.json();
        // Since offline mode appends note/mock, check for Gemini indicators
        setIsAiOnline(!data.note);
      }
    } catch (err) {
      setIsAiOnline(false);
    }
  };

  useEffect(() => {
    syncSessionProfile();
    diagnoseAiEngine();
  }, []);

  const handleToggleSkill = async (skillId: string, completed: boolean) => {
    try {
      const response = await fetch('/api/user/update-skill', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skillId, completed }),
      });
      if (response.ok) {
        // Refresh local stats
        await syncSessionProfile();
      }
    } catch (e) {
      console.error('Error toggling skill profile checklist:', e);
    }
  };

  const handleStartExploring = () => {
    setActiveTab('explorer');
  };

  const handleStartAnalyzing = () => {
    setPrefilledCareer('');
    setActiveTab('analyzer');
  };

  const handleAnalyzeCareer = (careerName: string) => {
    setPrefilledCareer(careerName);
    setActiveTab('analyzer');
  };

  // Submit Login/Registration Form
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authName.trim() || !authEmail.trim()) {
      setAuthError('Name and Email parameters correspond to required fields.');
      return;
    }
    setAuthError('');
    setAuthLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: authName,
          email: authEmail,
          role: authRole
        }),
      });

      if (!response.ok) {
        throw new Error('Registration failed.');
      }

      await syncSessionProfile();
      setLoginOpen(false);
      setAuthName('');
      setAuthEmail('');
    } catch (err: any) {
      setAuthError(err.message || 'Authenticating server connection error.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      await syncSessionProfile();
      setActiveTab('home');
    } catch (e) {
      console.error(e);
    }
  };

  // Route Rendering router switches
  const renderTabContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <Home 
            onStartExploring={handleStartExploring} 
            onStartAnalyzing={handleStartAnalyzing} 
            onOpenLogin={() => setLoginOpen(true)}
            isLoggedIn={!!user}
          />
        );
      case 'explorer':
        return (
          <CareerExplorer 
            onAnalyzeCareer={handleAnalyzeCareer} 
          />
        );
      case 'dashboard':
        return (
          <Dashboard
            user={user}
            goal={goal}
            skills={skills}
            onToggleSkill={handleToggleSkill}
            onNavigateTab={(tab) => {
              if (tab === 'study') {
                setActiveTab('study');
              } else {
                setActiveTab('analyzer');
              }
            }}
            isLoading={appInit}
          />
        );
      case 'analyzer':
        return (
          <GapAnalyzer 
            prefilledCareer={prefilledCareer}
            onRefreshDashboard={syncSessionProfile}
          />
        );
      case 'study':
        return (
          <StudyPlanner 
            careerGoal={goal?.targetCareer || ''}
            onRefreshDashboard={syncSessionProfile}
          />
        );
      case 'resume':
        return (
          <ResumeReviewer 
            careerGoal={goal?.targetCareer || ''}
          />
        );
      case 'interview':
        return (
          <InterviewSimulator 
            careerGoal={goal?.targetCareer || ''}
          />
        );
      case 'mentor':
        return (
          <MentorChat 
            careerGoal={goal?.targetCareer || ''}
          />
        );
      case 'internships':
        return (
          <Internships 
            careerGoal={goal?.targetCareer || ''}
          />
        );
      default:
        return <Home onStartExploring={handleStartExploring} onStartAnalyzing={handleStartAnalyzing} onOpenLogin={() => setLoginOpen(true)} isLoggedIn={!!user} />;
    }
  };

  if (appInit) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950 text-slate-150">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center animate-spin mx-auto text-white">
            <Brain className="w-6 h-6" />
          </div>
          <span className="text-xs uppercase tracking-widest font-mono text-slate-500 block">Initializing Workspace...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-950 text-slate-300 antialiased font-sans overflow-hidden">
      
      {/* Sidebar navigation */}
      <Navigation 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        user={user} 
        onLogout={handleLogout}
        onOpenLogin={() => setLoginOpen(true)}
        isAiOnline={isAiOnline}
      />

      {/* Main interactive application content panel */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18, ease: 'easeInOut' }}
            className="flex-1 flex flex-col overflow-hidden"
          >
            {renderTabContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Login Popup modal overlay */}
      {loginOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5"
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shrink-0">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Connect Professional Profile</h3>
                  <p className="text-[10px] text-slate-500 font-mono">Synchronize goals & roadmap</p>
                </div>
              </div>

              <button 
                onClick={() => setLoginOpen(false)} 
                className="p-1 hover:bg-slate-800 rounded-lg text-slate-500 hover:text-white transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {/* Name */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-wider text-slate-400 font-bold font-mono">Candidate Name</label>
                <input
                  type="text"
                  placeholder="e.g. Alex Developer"
                  value={authName}
                  onChange={(e) => setAuthName(e.target.value)}
                  className="w-full text-xs p-3 bg-slate-950 border border-slate-800 focus:border-indigo-600 rounded-xl text-white placeholder-slate-600 focus:outline-none transition animate-none"
                  required
                />
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-wider text-slate-400 font-bold font-mono">Email Address</label>
                <input
                  type="email"
                  placeholder="e.g. poojithachinni006@gmail.com"
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  className="w-full text-xs p-3 bg-slate-950 border border-slate-800 focus:border-indigo-600 rounded-xl text-white placeholder-slate-600 focus:outline-none transition"
                  required
                />
              </div>

              {/* Role */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-wider text-slate-400 font-bold font-mono">Current Career Level</label>
                <select
                  value={authRole}
                  onChange={(e) => setAuthRole(e.target.value)}
                  className="w-full text-xs p-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-600 transition cursor-pointer"
                >
                  <option value="Student / Aspiring Intern">Student / Aspiring Intern</option>
                  <option value="Junior Software Engineer">Junior Software Developer</option>
                  <option value="Mid Level Engineer">Mid Level Engineer</option>
                  <option value="Transitioning Professional">Transitioning Professional</option>
                </select>
              </div>

              {authError && (
                <div className="p-3 bg-rose-950/40 border border-rose-900/50 rounded-xl flex items-start gap-2 text-rose-400 text-[10px]">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={authLoading}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-505 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/10 flex items-center justify-center gap-2 cursor-pointer transition"
              >
                {authLoading ? (
                  <>
                    <Clock className="w-4 h-4 animate-spin" />
                    <span>Connecting Profile...</span>
                  </>
                ) : (
                  <span>Connect & Login</span>
                )}
              </button>

            </form>
          </motion.div>
        </div>
      )}

    </div>
  );
}
