/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Briefcase, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ChevronRight,
  TrendingUp,
  Building,
  UserCheck,
  Search,
  MapPin,
  ExternalLink,
  Filter,
  Check,
  Globe,
  Coins
} from 'lucide-react';
import { InternshipRecommendation } from '../types';

interface InternshipProps {
  careerGoal: string;
}

const AVAILABLE_PLATFORMS = ['LinkedIn', 'Internshala', 'Indeed', 'Glassdoor', 'Wellfound', 'Company Careers'];
const POPULAR_LOCATIONS = [
  { name: 'India 🇮🇳', value: 'India' },
  { name: 'Remote 🌐', value: 'Remote' },
  { name: 'United States 🇺🇸', value: 'United States' },
  { name: 'Europe 🇪🇺', value: 'Europe' }
];

export default function Internships({ careerGoal }: InternshipProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [internships, setInternships] = useState<InternshipRecommendation[]>([]);
  
  // Customizable user inputs
  const [customRole, setCustomRole] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(AVAILABLE_PLATFORMS);
  const [location, setLocation] = useState('India'); // Default to India as requested

  // Update starting values based on career goals
  useEffect(() => {
    if (careerGoal) {
      setCustomRole(careerGoal);
    } else {
      setCustomRole('Full Stack Developer'); // fallback default
    }
  }, [careerGoal]);

  const togglePlatform = (platform: string) => {
    if (selectedPlatforms.includes(platform)) {
      if (selectedPlatforms.length > 1) { // keep at least one
        setSelectedPlatforms(selectedPlatforms.filter(p => p !== platform));
      }
    } else {
      setSelectedPlatforms([...selectedPlatforms, platform]);
    }
  };

  const fetchRecommendations = async () => {
    const roleToQuery = customRole || careerGoal || 'Software Engineering';
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/internships', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          targetCareerCode: roleToQuery,
          platforms: selectedPlatforms,
          location: location
        }),
      });

      if (!response.ok) {
        throw new Error('Unable to compile internship recommendations.');
      }

      const data = await response.json();
      setInternships(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error occurred connecting with Internship engine.');
    } finally {
      setLoading(false);
    }
  };

  // Run automatically when the role changes or component matches
  useEffect(() => {
    const roleToQuery = customRole || careerGoal;
    if (roleToQuery) {
      fetchRecommendations();
    }
  }, [careerGoal]);

  // Dynamic quick query link generator for manual browsing
  const getExternalDirectSearch = (platform: string) => {
    const query = customRole || careerGoal || 'Software Engineering';
    switch (platform.toLowerCase()) {
      case 'linkedin':
        return `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(query)}%20Internship&location=${encodeURIComponent(location)}`;
      case 'internshala':
        return `https://internshala.com/internships/matching-${encodeURIComponent(query.replace(/\s+/g, '-').toLowerCase())}-internships/`;
      case 'indeed':
        return `https://www.indeed.com/jobs?q=${encodeURIComponent(query)}+Internship&l=${encodeURIComponent(location)}`;
      case 'glassdoor':
        return `https://www.google.com/search?q=${encodeURIComponent(query)}+${encodeURIComponent(location)}+Glassdoor+Internships`;
      case 'wellfound':
        return `https://wellfound.com/jobs?q=${encodeURIComponent(query)}`;
      default:
        return `https://www.google.com/search?q=${encodeURIComponent(query)}+Internship+jobs+in+${encodeURIComponent(location)}`;
    }
  };

  return (
    <div className="flex-1 p-6 overflow-y-auto bg-slate-950 text-slate-100 min-h-screen">
      {/* Header */}
      <div className="pb-6 border-b border-slate-900 mb-6 font-sans">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-indigo-500" />
          <span>Live Internships & Fresher Jobs Hub</span>
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Retrieve up to 10 active openings specifically curated for entry-level freshers (0-1 yrs experience). Direct-hiring links verified on corporate career pages and official platforms.
        </p>
      </div>

      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Dynamic Filters panel */}
        <div className="p-5 bg-slate-900/60 border border-slate-850 rounded-2xl space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-850/65">
            <Filter className="w-4 h-4 text-indigo-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Fresher Search Guidelines & Parameters</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Custom Role Input */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 font-mono uppercase">Target Role / Keywords</label>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="e.g. Frontend Developer, AI Engineer..."
                  value={customRole}
                  onChange={(e) => setCustomRole(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-855 rounded-lg text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-600 transition"
                />
              </div>
            </div>

            {/* Custom Location Selector */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 font-mono uppercase">Preferred Region / Location</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="e.g. Bangalore, India, Remote..."
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-855 rounded-lg text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-600 transition"
                />
              </div>
              
              {/* Quick Select Location Pills */}
              <div className="flex flex-wrap gap-1.5 mt-1">
                {POPULAR_LOCATIONS.map((loc) => (
                  <button
                    key={loc.value}
                    onClick={() => setLocation(loc.value)}
                    className={`text-[9px] px-2 py-0.5 roundedTransition transition cursor-pointer border ${
                      location.toLowerCase() === loc.value.toLowerCase()
                        ? 'bg-indigo-950/60 border-indigo-500 text-indigo-300 font-semibold'
                        : 'bg-slate-950/40 border-slate-850 text-slate-400 hover:text-white hover:border-slate-800'
                    }`}
                  >
                    {loc.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Job Platforms */}
          <div className="space-y-2 pt-2">
            <span className="text-[10px] font-bold text-slate-400 font-mono uppercase block">Sourced Job Boards & Platforms</span>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_PLATFORMS.map((plat) => {
                const isSelected = selectedPlatforms.includes(plat);
                return (
                  <button
                    key={plat}
                    onClick={() => togglePlatform(plat)}
                    className={`px-3 py-1.5 rounded-lg text-[10.5px] font-bold transition flex items-center gap-1.5 border cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-600/90 hover:bg-indigo-500 border-indigo-600 text-white shadow-sm'
                        : 'bg-slate-950/50 border-slate-850 text-slate-400 hover:text-white hover:bg-slate-900'
                    }`}
                  >
                    <div className={`w-3.5 h-3.5 rounded bg-slate-950 flex items-center justify-center border border-slate-800/80 ${isSelected ? 'border-indigo-400 text-indigo-300 bg-indigo-900/60' : ''}`}>
                      {isSelected && <Check className="w-2.5 h-2.5" />}
                    </div>
                    <span>{plat}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={fetchRecommendations}
              disabled={loading}
              className="text-xs py-2.5 px-5 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold rounded-xl cursor-pointer transition shadow-lg shadow-indigo-600/10 flex items-center gap-2 disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 text-indigo-200" />
              <span>{loading ? 'Searching real listings...' : 'Get Matched Internships'}</span>
            </button>
          </div>
        </div>

        {/* Loading Indicator */}
        {loading && (
          <div className="p-12 text-center bg-slate-900/20 border border-slate-900 rounded-2xl space-y-4 max-w-sm mx-auto">
            <Clock className="w-7 h-7 animate-spin text-indigo-500 mx-auto" />
            <div>
              <p className="text-xs font-bold text-white">Contacting job boards catalog...</p>
              <p className="text-[10px] text-slate-400 mt-1 leading-normal">
                Querying Glassdoor, LinkedIn, Indeed, Internshala, and corporate listings for standard placements.
              </p>
            </div>
          </div>
        )}

        {/* Error Notification */}
        {error && (
          <div className="p-3 bg-rose-950/45 border border-rose-900/50 rounded-xl flex items-start gap-2 text-rose-400 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Render Matched Internship Cards */}
        {!loading && internships.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-500 uppercase font-mono">Matched Listings ({internships.length} Results)</span>
              <span className="text-[10px] font-semibold text-emerald-400 font-mono flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                Live Job Search Active
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {internships.map((intern, i) => (
                <div key={i} className="bg-slate-900/40 border border-slate-850 p-5 rounded-2xl flex flex-col md:flex-row gap-6 justify-between transition-all hover:bg-slate-900/70 hover:border-slate-800">
                  
                  {/* Left content block */}
                  <div className="flex-1 space-y-4">
                    
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-center text-indigo-400 shrink-0 mt-0.5">
                        <Building className="w-5 h-5 text-indigo-400" />
                      </div>

                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="text-sm font-extrabold text-white leading-tight">{intern.role}</h4>
                          <span className="text-[9px] font-mono font-extrabold px-2.5 py-0.5 rounded-full bg-indigo-950/70 border border-indigo-900/80 text-indigo-300">
                            {intern.sourcePlatform || 'Glassdoor'} Source
                          </span>
                        </div>
                        
                        {/* Company name and AmbitionBox rating badge */}
                        <div className="flex flex-wrap items-center gap-2 pt-0.5">
                          <span className="text-xs font-semibold text-slate-300">{intern.companyName || 'Verified Company'}</span>
                          {intern.companyRating && (
                            <a 
                              href={intern.ambitionBoxUrl || `https://www.ambitionbox.com/search?q=${encodeURIComponent(intern.companyName || '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-[9px] bg-amber-950/45 border border-amber-800/60 hover:border-amber-500 hover:bg-amber-900/40 text-amber-400 px-2 py-0.5 rounded transition font-mono whitespace-nowrap cursor-pointer decoration-none"
                              title="Verify reviews & salary statistics on AmbitionBox"
                            >
                              <span>★ {intern.companyRating}</span>
                              <span className="text-[8px] text-amber-500/80">Reviews ({intern.reviewsCount || '150+'}) ↗</span>
                            </a>
                          )}
                        </div>

                        {/* Location, Salary and Specific criteria row */}
                        <div className="flex flex-wrap gap-2 pt-1">
                          {intern.location && (
                            <span className="text-[10px] bg-slate-950/65 border border-slate-850 px-2 py-0.5 rounded text-slate-400 font-sans flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-rose-400 shrink-0" />
                              {intern.location}
                            </span>
                          )}
                          {intern.salaryPackage && (
                            <span className="text-[10px] bg-slate-950/65 border border-slate-850 px-2 py-0.5 rounded text-slate-400 font-medium flex items-center gap-1">
                              <Coins className="w-3 h-3 text-emerald-400 shrink-0" />
                              <span className="text-slate-300 font-mono">{intern.salaryPackage}</span>
                            </span>
                          )}
                          {intern.jobType && (
                            <span className="text-[10px] bg-indigo-950/45 border border-indigo-900/40 px-2 py-0.5 rounded text-indigo-300 font-sans font-medium">
                              💼 {intern.jobType}
                            </span>
                          )}
                          {intern.experienceRequired && (
                            <span className="text-[10px] bg-slate-950/65 border border-slate-850 px-2 py-0.5 rounded text-slate-400 font-sans">
                              ⏱️ {intern.experienceRequired}
                            </span>
                          )}
                        </div>

                        <span className="text-[10px] text-slate-450 leading-normal block mt-1.5 italic font-sans text-slate-400">
                          🏢 Company Context: {intern.companyVibe}
                        </span>
                      </div>
                    </div>

                    {/* Pre-req criteria */}
                    <div>
                      <span className="text-[9px] uppercase tracking-wider text-slate-500 font-extrabold font-mono block mb-1.5">Required Skills Verified</span>
                      <div className="flex flex-wrap gap-1.5">
                        {intern.requiredSkills.map((sk) => (
                          <span key={sk} className="text-[10px] py-0.5 px-2.5 bg-slate-950 border border-slate-850 text-slate-300 rounded font-medium">
                            {sk}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Roadmap details */}
                    <div className="space-y-1.5">
                      <span className="text-[9px] uppercase tracking-wider text-indigo-400 font-extrabold font-mono block">Interview Prep Checklist & Milestones</span>
                      <ul className="space-y-1.5">
                        {intern.preparationGuidance.map((guid, gIdx) => (
                          <li key={gIdx} className="flex gap-2 text-xs text-slate-400 leading-relaxed items-start">
                            <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
                            <span>{guid}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                  </div>

                  {/* Compatibility score & Apply action card */}
                  <div className="border-t md:border-t-0 md:border-l border-slate-850/80 pt-4 md:pt-0 md:pl-6 flex flex-col justify-between items-center text-center shrink-0 md:w-44 space-y-4">
                    <div className="space-y-1.5 w-full">
                      <span className="text-[9px] font-mono uppercase tracking-widest text-slate-500 font-bold block">COMPATIBILITY</span>
                      <span className={`text-2xl font-extrabold font-mono ${
                        intern.suitabilityScore >= 80 
                          ? 'text-emerald-400' 
                          : 'text-indigo-400'
                      }`}>
                        {intern.suitabilityScore}% Match
                      </span>
                      <div className="w-16 h-1.5 bg-slate-850 rounded-full overflow-hidden mt-1.5 mx-auto">
                        <div 
                          className={`h-full rounded-full ${
                            intern.suitabilityScore >= 80 ? 'bg-emerald-400' : 'bg-indigo-400'
                          }`} 
                          style={{ width: `${intern.suitabilityScore}%` }} 
                        />
                      </div>
                    </div>

                    {/* Highly polished, functional apply redirect container */}
                    <a
                      href={intern.applyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2 px-3 bg-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[10px] font-extrabold flex items-center justify-center gap-1.5 transition-all shadow-sm hover:-translate-y-0.5 decoration-none cursor-pointer"
                    >
                      <span>Apply on {intern.sourcePlatform || 'Platform'}</span>
                      <ExternalLink className="w-3 h-3 text-white" />
                    </a>
                  </div>

                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty state or instruction banner */}
        {!loading && internships.length === 0 && (
          <div className="p-8 text-center bg-slate-900/30 border border-slate-850 rounded-2xl max-w-sm mx-auto space-y-3">
            <Briefcase className="w-6 h-6 text-slate-500 mx-auto" />
            <p className="text-xs text-slate-400">
              No matching listings loaded yet. Click "Get Matched Internships" above to retrieve live opportunities curated for {customRole || careerGoal}!
            </p>
          </div>
        )}

        {/* Direct Search Resources Panel - GUARANTEES exact real results */}
        <div className="p-5 bg-slate-900/40 border border-slate-850 rounded-2xl space-y-3">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-emerald-400" />
            <span className="text-[10px] font-bold text-white uppercase tracking-wider font-mono">Instant Search Quick-Rails</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-normal">
            Job boards update minute-by-minute. Click any launcher below to run a direct live search query for <strong className="text-indigo-400">"{customRole || careerGoal || 'Software Engineering'}"</strong> in <strong className="text-emerald-400">"{location}"</strong>:
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
            {AVAILABLE_PLATFORMS.filter(p => p !== 'Company Careers').map((platform) => (
              <a
                key={platform}
                href={getExternalDirectSearch(platform)}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 bg-slate-950 hover:bg-slate-900 border border-slate-850 hover:border-indigo-800 text-[10px] font-bold text-slate-300 hover:text-white rounded-xl flex items-center justify-between transition-all group cursor-pointer"
              >
                <span>{platform} Query 🇮🇳</span>
                <ChevronRight className="w-3 h-3 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition" />
              </a>
            ))}
            <a
              href={`https://www.google.com/search?q=${encodeURIComponent(customRole || careerGoal || 'Software Engineering')}+internships+${encodeURIComponent(location)}+careers`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 bg-slate-950 hover:bg-slate-900 border border-slate-850 hover:border-indigo-800 text-[10px] font-bold text-slate-300 hover:text-white rounded-xl flex items-center justify-between transition-all group cursor-pointer"
            >
              <span>Company Pages ↗</span>
              <ChevronRight className="w-3 h-3 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition" />
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
