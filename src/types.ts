/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Core database structure
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export interface CareerGoal {
  id: string;
  userId: string;
  targetCareer: string;
  readinessScore: number;
}

export interface UserSkill {
  id: string;
  userId: string;
  skillName: string;
  completed: boolean;
  category?: 'core' | 'missing' | 'custom';
}

export interface RoadmapItem {
  name: string;
  description: string;
  estimatedDuration: string;
  resources: string[];
}

export interface RoadmapPhase {
  skills: string[];
  topics?: {
    name: string;
    description: string;
    duration: string;
  }[];
  projects: {
    title: string;
    description: string;
    complexity: 'Beginner' | 'Intermediate' | 'Advanced';
    features: string[];
  }[];
  resources: {
    title: string;
    url: string;
    type: 'Video' | 'Course' | 'Article' | 'Documentation';
  }[];
  estimatedDuration: string;
}

export interface RoadmapData {
  career: string;
  beginner: RoadmapPhase;
  intermediate: RoadmapPhase;
  advanced: RoadmapPhase;
}

export interface Roadmap {
  id: string;
  userId: string;
  roadmapData: RoadmapData;
  createdAt: string;
}

export interface StudyPlanDay {
  dayName: string;
  topic: string;
  hours: number;
  completed: boolean;
}

export interface StudyPlanWeek {
  weekNumber: number;
  focus: string;
  days: StudyPlanDay[];
  milestones: string[];
}

export interface StudyPlan {
  id: string;
  userId: string;
  career: string;
  hoursPerDay: number;
  targetDate: string;
  weeks: StudyPlanWeek[];
  createdAt: string;
}

export interface ResumeAnalysis {
  atsScore: number;
  qualityScore: number;
  missingSkills: string[];
  improvementSuggestions: string[];
  matchedSkills: string[];
}

export interface InterviewQuestion {
  id: string;
  career: string;
  type: 'Technical' | 'Coding' | 'HR';
  question: string;
  sampleAnswer?: string;
  guidance?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}

export interface InternshipRecommendation {
  role: string;
  companyName?: string;
  companyRating?: string;
  reviewsCount?: string;
  ambitionBoxUrl?: string;
  jobType?: string;
  location?: string;
  salaryPackage?: string;
  experienceRequired?: string;
  companyVibe: string;
  requiredSkills: string[];
  preparationGuidance: string[];
  suitabilityScore: number;
  sourcePlatform?: string;
  applyUrl?: string;
}

export interface CareerDetails {
  title: string;
  description: string;
  salaryMin: number;
  salaryMax: number;
  skills: string[];
  certifications: string[];
  marketDemand: 'High' | 'Medium' | 'Low';
  topRecruiters?: CompanyRecruiterSummary[];
}

export interface CompanyRecruiterSummary {
  name: string;
  rating: string;
  reviews: string;
  fresherSalary: string;
  midSalary: string;
  internshipStipend: string;
  location: string;
  careersUrl: string;
  ambitionBoxUrl: string;
  hiringStatus: string;
}

export interface CompanyProfile {
  id: string;
  name: string;
  sector: string;
  rating: string;
  reviewsCount: string;
  fresherCtc: string;
  midLevelCtc: string;
  seniorCtc: string;
  internStipend: string;
  locations: string[];
  headquarters: string;
  about: string;
  workCulture: string;
  benefits: string[];
  openRolesCount: number;
  hiringBatch: string;
  directCareersUrl: string;
  ambitionBoxUrl: string;
  featuredRoles: string[];
  updatedAt: string;
}

export interface MarketPulse {
  lastUpdated: string;
  nextUpdateInSeconds: number;
  cycleNumber: number;
  activeJobsCount: number;
  activeCompaniesCount: number;
  fresherAverageLpa: string;
  topHiringSector: string;
  companies: CompanyProfile[];
}

export interface AiConfig {
  openRouterApiKey?: string;
  preferredModel?: string;
  preferredProvider?: 'gemini' | 'openrouter' | 'auto';
}

export interface AiStatus {
  geminiAvailable: boolean;
  openRouterAvailable: boolean;
  activeProvider: 'gemini' | 'openrouter' | 'local';
  preferredModel: string;
  hasOpenRouterKey: boolean;
  maskedKey: string;
}
