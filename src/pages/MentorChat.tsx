/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, 
  Send, 
  Sparkles, 
  User as UserIcon, 
  Clock, 
  HelpCircle,
  Cpu,
  Brain,
  Award,
  BookOpen
} from 'lucide-react';
import { ChatMessage } from '../types';

interface MentorChatProps {
  careerGoal: string;
}

export default function MentorChat({ careerGoal }: MentorChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: `Hello! I'm your dedicated AI Career Mentor. I'm equipped with standard industry insights and field knowledge to help you transition into becoming an expert in ${careerGoal || 'your target technical space'}. 

What is your current progress, or is there any specific framework certification you would like to analyze today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e?: React.FormEvent, customPresetText?: string) => {
    if (e) e.preventDefault();
    const activeText = customPresetText || inputText;
    if (!activeText.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: 'usr-' + Math.random().toString(36).substring(2, 9),
      role: 'user',
      text: activeText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setLoading(true);

    try {
      const response = await fetch('/api/career-mentor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          career: careerGoal || 'Software Professional',
          message: activeText,
          chatHistory: messages.map(m => ({ role: m.role, text: m.text }))
        }),
      });

      if (!response.ok) {
        throw new Error('Mentor model is currently busy. Please retry.');
      }

      const data = await response.json();
      
      const responseMsg: ChatMessage = {
        id: 'mnt-' + Math.random().toString(36).substring(2, 9),
        role: 'model',
        text: data.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, responseMsg]);

    } catch (err: any) {
      console.error(err);
      const errMsg: ChatMessage = {
        id: 'err-' + Math.random().toString(36).substring(2, 9),
        role: 'model',
        text: 'Mentorship connection experienced minor latency difficulties. Please check your config parameters or try sending your message again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setLoading(false);
    }
  };

  const PresetPrompts = [
    { label: 'Recommended Certifications', text: `What are the top 2 highly recognized industry certifications I should pursue to prepare for a career in ${careerGoal || 'my target path'}?` },
    { label: 'High Impact Portfolios', text: `Give me 2 distinct full-stack portfolio ideas to prove skill competency in ${careerGoal || 'this track'} to hiring gatekeepers.` },
    { label: 'Interview Preparation Tips', text: 'Detail the absolute top critical behavioral and technical pitfalls candidates experience during final hiring reviews.' },
  ];

  return (
    <div className="flex-1 p-6 overflow-y-auto bg-slate-950 text-slate-100 flex flex-col md:flex-row gap-6 min-h-screen">
      
      {/* Sidebar Advice Panel */}
      <div className="w-full md:w-64 shrink-0 flex flex-col justify-between space-y-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2.5 pb-3.5 border-b border-slate-900">
            <span className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shrink-0">
              <Brain className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-xs font-extrabold text-white leading-none">AI Mentoring Room</h3>
              <span className="text-[10px] text-slate-500 font-mono tracking-wider">MAPPED TO GOALS</span>
            </div>
          </div>

          <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
            Your personal mentor is equipped to outline resume tweaks, project parameters, framework options, salary ranges, and technical guidance on demand.
          </p>

          {/* Quick Preset Action prompts */}
          <div className="space-y-2.5 pt-3">
            <span className="text-[9px] uppercase tracking-wider text-slate-500 font-bold font-mono">Quick Inquire Queries</span>
            <div className="space-y-2 flex flex-col">
              {PresetPrompts.map((pre, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(undefined, pre.text)}
                  disabled={loading}
                  className="w-full text-left p-2.5 bg-slate-900/50 hover:bg-slate-900/90 hover:border-slate-800 text-[10px] text-slate-400 rounded-xl leading-normal border border-slate-900 transition flex items-start gap-2 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                  <span>{pre.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Advisory widget */}
        <div className="p-3 bg-indigo-950/15 border border-indigo-950/40 rounded-xl flex items-start gap-2">
          <HelpCircle className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
          <p className="text-[10px] text-slate-400 leading-normal">
            <span className="text-white font-semibold block mb-0.5">Advice parameters:</span>
            Responses are kept short and highly practical. Make sure your active target career is defined in the panel menus!
          </p>
        </div>
      </div>

      {/* Main Conversational Terminal Column */}
      <div className="flex-1 bg-slate-900/50 border border-slate-850 rounded-2xl flex flex-col justify-between overflow-hidden relative">
        
        {/* Chat Header Status */}
        <div className="p-4 bg-slate-900 border-b border-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <div>
              <h3 className="text-xs font-extrabold text-white leading-none">Live Copilot Consultant Session</h3>
              <span className="text-[9px] text-slate-500 font-mono">Active Target focus: {careerGoal || 'General Trajectories'}</span>
            </div>
          </div>

          <MessageSquare className="w-4 h-4 text-slate-550 text-slate-500" />
        </div>

        {/* Conversation Stream list */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4 max-h-[420px] custom-scrollbar bg-slate-950/20">
          {messages.map((m) => {
            const isUser = m.role === 'user';
            return (
              <div key={m.id} className={`flex gap-3 max-w-xl ${isUser ? 'ml-auto flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${
                  isUser 
                    ? 'bg-slate-800 border-slate-700 text-slate-200' 
                    : 'bg-indigo-600 border-indigo-500 text-white shadow-md'
                }`}>
                  {isUser ? <UserIcon className="w-4 h-4" /> : <Cpu className="w-4 h-4" />}
                </div>

                <div className="space-y-1">
                  <div className={`p-3 rounded-2xl text-xs leading-relaxed max-w-full font-sans shadow-md break-words whitespace-pre-wrap ${
                    isUser 
                      ? 'bg-indigo-600 text-white rounded-tr-none' 
                      : 'bg-slate-900 text-slate-200 border border-slate-850 rounded-tl-none font-medium'
                  }`}>
                    {m.text}
                  </div>
                  
                  <span className={`text-[8px] font-mono text-slate-500 block ${isUser ? 'text-right' : ''}`}>
                    {m.timestamp}
                  </span>
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex gap-3 max-w-xl">
              <div className="w-8 h-8 rounded-full bg-indigo-600 border border-indigo-505 flex items-center justify-center text-white shrink-0">
                <Cpu className="w-4 h-4 animate-spin" />
              </div>
              <div className="p-3 bg-slate-900 text-slate-400 text-xs rounded-2xl rounded-tl-none border border-slate-850 animate-pulse italic leading-none flex items-center gap-1.5">
                <span>Mentor is drafting core advise rules...</span>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input form */}
        <div className="p-4 bg-slate-900 border-t border-slate-950">
          <form onSubmit={(e) => handleSendMessage(e)} className="flex gap-2">
            <input
              type="text"
              placeholder={`Ask anything about transitioning into matching trajectories...`}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 bg-slate-950 border border-slate-850 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-indigo-600 placeholder-slate-600 transition"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !inputText.trim()}
              className="px-5 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold shadow-lg shrink-0 flex items-center justify-center gap-1.5 cursor-pointer transition"
            >
              <span>Consult</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
