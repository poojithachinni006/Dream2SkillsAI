/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Compass, 
  Search, 
  TrendingUp, 
  DollarSign, 
  Award, 
  CheckCircle, 
  Cpu, 
  Database, 
  Terminal, 
  Globe, 
  ShieldCheck, 
  Cloud, 
  Infinity as LoopIcon, 
  Sparkles,
  ArrowRight,
  Smartphone,
  PenTool,
  Server,
  CheckSquare,
  Briefcase,
  Coins,
  Zap,
  Wrench,
  Building,
  Beaker,
  Plane,
  Dna,
  Radio,
  Bot,
  RefreshCw,
  Clock,
  ExternalLink,
  MapPin,
  Users,
  CheckCircle2,
  ChevronRight,
  SlidersHorizontal
} from 'lucide-react';
import { CareerDetails, MarketPulse, CompanyProfile } from '../types';
import { VERIFIED_COMPANIES, getRecruitersForCareer } from '../data/marketData';

interface CareerExplorerProps {
  onAnalyzeCareer: (career: string) => void;
}

const CURRENCIES = [
  { code: 'INR', symbol: '₹', rate: 83.5, label: 'Indian Rupee (₹)', locale: 'en-IN' },
  { code: 'USD', symbol: '$', rate: 1.0, label: 'US Dollar ($)', locale: 'en-US' },
  { code: 'EUR', symbol: '€', rate: 0.92, label: 'Euro (€)', locale: 'de-DE' },
  { code: 'GBP', symbol: '£', rate: 0.79, label: 'British Pound (£)', locale: 'en-GB' }
];

const DEFAULT_CAREERS: CareerDetails[] = [
  {
    title: 'AI Engineer',
    description: 'Specializes in integrating pre-trained Large Language Models, developing multi-agent retrieval frameworks (RAG), orchestrating memory states, and fine-tuning lightweight models for scalable production software.',
    salaryMin: 125000,
    salaryMax: 195000,
    skills: ['LangChain/LlamaIndex', 'Python', 'Vector DBs (Chroma/Pinecone)', 'Embeddings', 'API Security', 'Model fine-tuning (QLoRA)'],
    certifications: ['Google Cloud Certified Professional Machine Learning Engineer', 'DeepLearning.AI Generative AI Developer'],
    marketDemand: 'High'
  },
  {
    title: 'Data Scientist',
    description: 'Derives actionable corporate indicators and models from complex data sets. Discovers statistical trends, configures predictive analytics pipelines, runs regression models, and visualizes predictions.',
    salaryMin: 110000,
    salaryMax: 175000,
    skills: ['Statistical modeling', 'R/Python', 'Pandas & NumPy', 'Data Cleansing', 'Regression & Tree classifiers', 'D3/Tableau'],
    certifications: ['IBM Data Science Professional', 'AWS Certified Data Analytics'],
    marketDemand: 'High'
  },
  {
    title: 'Machine Learning Engineer',
    description: 'Researches, builds, designs, and refines custom deep-learning architectures. Focuses on data pipelines at scale, model performance metrics, convolutional layers, transformers, and neural systems.',
    salaryMin: 130000,
    salaryMax: 210000,
    skills: ['TensorFlow/PyTorch', 'C++', 'Gradient boosting models', 'Neural Net architectures', 'Data processing pipelines', 'Model profiling'],
    certifications: ['Google Professional ML Engineer', 'AWS Machine Learning Specialization'],
    marketDemand: 'High'
  },
  {
    title: 'Full Stack Developer',
    description: 'Builds, manages, and maintains responsive front-end user components and robust back-end server REST API systems, state orchestration networks, databases, and secure authentication loops.',
    salaryMin: 95000,
    salaryMax: 160000,
    skills: ['React/Next.js', 'Node.js/Express', 'PostgreSQL', 'TypeScript', 'Tailwind CSS', 'REST & GraphQL APIs'],
    certifications: ['Meta Full-Stack Developer Certificate', 'AWS Certified Developer Associate'],
    marketDemand: 'Medium'
  },
  {
    title: 'Frontend Developer',
    description: 'Constructs highly responsive, visually stunning web interfaces using React, Vue, or Angular. Handles client-side routing, accessibility layout grids, visual components styling, UI animations, and modular bundle optimizations.',
    salaryMin: 85000,
    salaryMax: 140000,
    skills: ['React/React-Router', 'HTML5 & CSS3', 'Tailwind CSS', 'TypeScript', 'Responsive Design', 'Vite/Webpack bundles'],
    certifications: ['Meta Front-End Developer Certificate', 'UX/UI Foundations Certification'],
    marketDemand: 'High'
  },
  {
    title: 'Backend Developer',
    description: 'Engineers performant API architectures, database layouts, secure auth layers, and cloud integrations. Architects robust microservices, scales SQL and NoSQL engines, and secures credentials.',
    salaryMin: 95000,
    salaryMax: 155000,
    skills: ['Node.js/Express', 'Python/FastAPI', 'PostgreSQL/MySQL', 'Redis Caching', 'Authentication (OAuth/JWT)', 'Docker containers'],
    certifications: ['AWS Certified Solutions Developer', 'Google Cloud Certified Associate Cloud Engineer'],
    marketDemand: 'High'
  },
  {
    title: 'Mobile App Developer',
    description: 'Develops native or cross-platform applications for iOS and Android platforms. Optimizes mobile performance, integrates device notifications, coordinates offline state caching, and submits builds to Apple App Store & Google Play Store.',
    salaryMin: 90000,
    salaryMax: 145000,
    skills: ['React Native / Flutter', 'Swift / SwiftUI', 'Kotlin / Jetpack Compose', 'Mobile Security', 'Offline Sync databases', 'Store App Deployment'],
    certifications: ['Google Associate Android Developer', 'Meta iOS/Android Developer Professional'],
    marketDemand: 'High'
  },
  {
    title: 'Product Manager',
    description: 'Bridges business requirements, software development, and UI/UX design. Formulates strategic product development roadmaps, defines functional MVPs, analyses user metrics, and leads cross-functional sprints.',
    salaryMin: 110000,
    salaryMax: 180000,
    skills: ['Sprint Management (Agile)', 'Product Lifecycle Metrics', 'User Research Methodologies', 'Figma Wireframing', 'Data analytics tools', 'Strategic Roadmap planning'],
    certifications: ['Certified Scrum Product Owner (CSPO)', 'Pragmatic Product Management Gold License'],
    marketDemand: 'High'
  },
  {
    title: 'UI/UX Designer',
    description: 'Researches and designs beautiful, highly accessible product experiences. Crafts vector design guidelines, user journey diagrams, comprehensive design systems, high-fidelity interactive wireframes, and runs usability tests.',
    salaryMin: 75000,
    salaryMax: 130000,
    skills: ['Figma design systems', 'User journey mapping', 'Wireframing & Prototyping', 'Accessibility audits (WCAG)', 'Interaction Micro-animations', 'A/B testing tools'],
    certifications: ['Google UX Design Professional Certificate', 'Interaction Design Foundation Certified'],
    marketDemand: 'High'
  },
  {
    title: 'QA / Test Automation Engineer',
    description: 'Designs and executes comprehensive automated test suites to enforce code quality standards. Assesses system regressions, executes load/stress tests, configures continuous integration checks, and reports bugs.',
    salaryMin: 70000,
    salaryMax: 115000,
    skills: ['Selenium / Cypress', 'Playwright framework', 'API unit-testing Integration', 'CI/CD pipeline workflow', 'Load Testing (JMeter)', 'Behavioral Driven Development (BDD)'],
    certifications: ['ISTQB Certified Tester', 'Certified Software Test Automation Specialist'],
    marketDemand: 'Medium'
  },
  {
    title: 'Data Analyst',
    description: 'Collects, processes, and performs statistical analyses on structured data sets. Translates numerical indicators into clear business intelligence, KPI decks, and interactive dashboards.',
    salaryMin: 70000,
    salaryMax: 115000,
    skills: ['SQL queries', 'Excel modeling', 'Power BI / Excel', 'Data wrangling', 'Business intelligence reporting', 'A/B Testing analysis'],
    certifications: ['Google Data Analytics Certificate', 'Microsoft Certified: Power BI Data Analyst Associate'],
    marketDemand: 'Medium'
  },
  {
    title: 'Cybersecurity Analyst',
    description: 'Shields organizational cloud environments, private servers, and client networks from active security threats, runs intrusion simulations, audits compliance factors, and secures endpoints.',
    salaryMin: 105000,
    salaryMax: 165000,
    skills: ['Firewalls & IDS', 'Penetration testing', 'Linux System structures', 'Cryptography models', 'SIEM tools', 'Incident response protocols'],
    certifications: ['CompTIA Security+', 'Certified Information Systems Security Professional (CISSP)'],
    marketDemand: 'High'
  },
  {
    title: 'Cloud Engineer',
    description: 'Maintains, scales, and manages elastic cloud infrastructures across major hosting providers. Implements storage backends, virtual tunnels, security permissions, and backups.',
    salaryMin: 115000,
    salaryMax: 180000,
    skills: ['AWS / GCP / Azure services', 'IAM Security controls', 'Serverless microarchitectures', 'Cloud storage systems', 'Virtual private networks', 'Pricing audits'],
    certifications: ['AWS Certified Solutions Architect Associate', 'Google Associate Cloud Engineer'],
    marketDemand: 'High'
  },
  {
    title: 'DevOps Engineer',
    description: 'Bridges software building loops with production container deployment workflows. Standardizes continuous integration checks, metrics monitoring pipelines, and infrastructure as code automation.',
    salaryMin: 120000,
    salaryMax: 190000,
    skills: ['Docker & Kubernetes', 'CI/CD (GitHub Actions/Jenkins)', 'Terraform (IaC)', 'Linux Admin', 'Prometheus & Grafana', 'Bash scripting'],
    certifications: ['Certified Kubernetes Administrator (CKA)', 'HashiCorp Certified: Terraform Associate'],
    marketDemand: 'High'
  },
  {
    title: 'Blockchain Developer',
    description: 'Specializes in decentralized cryptographic applications, smart contracts validation (Solidity/Rust), consensus protocol architecture, distributed ledger nodes, and Web3 frontend integration frameworks.',
    salaryMin: 115005,
    salaryMax: 185000,
    skills: ['Solidity & Rust', 'Web3.js & Ethers.js', 'Smart Contracts Security', 'Cryptography protocols', 'Hyperledger / Ethereum mesh'],
    certifications: ['Certified Blockchain Developer (CBD)', 'Certified Solidity Developer'],
    marketDemand: 'High'
  },
  {
    title: 'Data Engineer',
    description: 'Architects stable data processing operations, builds dynamic ETL/ELT pipelines, normalizes warehouse storage (Snowflake/BigQuery), manages streaming brokers (Kafka), and scales Apache Spark routines.',
    salaryMin: 105000,
    salaryMax: 170000,
    skills: ['Python & SQL', 'Apache Spark / Hadoop', 'dbt (data build tool)', 'Snowflake / BigQuery', 'Airflow Pipelines', 'Kafka Streams'],
    certifications: ['Google Cloud Professional Data Engineer', 'AWS Certified Data Analytics'],
    marketDemand: 'High'
  },
  {
    title: 'Systems Architect',
    description: 'Designs microservices topology, multi-region load strategies, resilience failovers, high-throughput caching, event-driven mesh networks, and coordinates technical scaling compliance.',
    salaryMin: 140000,
    salaryMax: 230000,
    skills: ['System Design Scale', 'Microservices', 'EDA (Event-Driven Arch)', 'Redis / Memcached mesh', 'PCI-DSS Compliance audits'],
    certifications: ['AWS Certified Solutions Architect Professional', 'Google Professional Cloud Architect'],
    marketDemand: 'High'
  },
  {
    title: 'Embedded Systems & IoT Engineer',
    description: 'Connects physical microcontrollers and IoT nodes, builds real-time operating systems firmware (C/C++), optimizes memory registers, and schedules low-latency communication buses.',
    salaryMin: 85000,
    salaryMax: 135000,
    skills: ['C / C++', 'RTOS microcontrollers', 'ARM assembly registers', 'I2C/SPI/UART buses', 'BLE & Zigbee networks', 'Oscilloscope debugging'],
    certifications: ['Embedded Systems Engineering Certificate', 'ARM Certified Engineer'],
    marketDemand: 'Medium'
  },
  {
    title: 'Game Developer',
    description: 'Programs real-time rendering layers, physics engines, entity-component systems, multiplayer gameplay mechanics, custom shader nodes, and asset-pipeline compilers (C++/C#/Unreal).',
    salaryMin: 80000,
    salaryMax: 130000,
    skills: ['C++ / C#', 'Unity or Unreal Engine', 'DirectX / OpenGL math', 'Entity-Component Systems', 'Custom HLSL shaders', 'GPU optimization profiling'],
    certifications: ['Unity Certified Programmer', 'Unreal Engine Authorized Developer'],
    marketDemand: 'High'
  },
  {
    title: 'Electrical Engineer',
    description: 'Designs and analyzes hardware circuits, power generation grids, electrical machines, and control packages, integrating modern smart grid telemetry.',
    salaryMin: 65000,
    salaryMax: 115000,
    skills: ['MATLAB/Simulink', 'Power System Analysis', 'Circuit Designing', 'Control Systems', 'Microcontrollers', 'Smart Grid Systems'],
    certifications: ['Certified Power System Professional', 'IEEE Certified Electrical Engineer'],
    marketDemand: 'Medium'
  },
  {
    title: 'Mechanical Engineer',
    description: 'Designs, develops, and tests mechanical components, thermal systems, dynamic mechanisms, fluid conduits, and automated product assemblies.',
    salaryMin: 60000,
    salaryMax: 110000,
    skills: ['SolidWorks / AutoCAD', 'Finite Element Analysis (FEA)', 'Thermodynamics', 'Fluid Dynamics', 'Robotics Kinematics', 'CNC Programming'],
    certifications: ['Certified SolidWorks Associate (CSWA)', 'ASME Mechanical Engineering Certificate'],
    marketDemand: 'Medium'
  },
  {
    title: 'Civil Engineer',
    description: 'Plans, designs, and oversees construction of structural infrastructure, including buildings, transport links, environmental reservoirs, and smart cities.',
    salaryMin: 55000,
    salaryMax: 105000,
    skills: ['AutoCAD / Revit', 'STAAD Pro / ETABS', 'Structural Analysis', 'Geotechnical Surveying', 'GIS Mapping', 'BIM Modeling'],
    certifications: ['BIM Certified Professional', 'Institution of Civil Engineers (ICE) Accreditation'],
    marketDemand: 'Medium'
  },
  {
    title: 'Chemical Engineer',
    description: 'Designs chemical manufacturing processes, reaction chambers, biochemical solutions, refinery systems, and safety-compliant materials synthesis.',
    salaryMin: 70000,
    salaryMax: 120000,
    skills: ['ASPEN Plus', 'Process Control & Simulation', 'Chemical Kinetics', 'Thermodynamic modeling', 'Mass Transfer operations', 'Safety Risk Assessment'],
    certifications: ['AIChE Process Safety Certification', 'Certified Process Engineer'],
    marketDemand: 'Medium'
  },
  {
    title: 'Aerospace Engineer',
    description: 'Researches, simulates, and constructs high-performance aircraft, space propulsion modules, aerodynamic structures, and advanced avionics control units.',
    salaryMin: 90000,
    salaryMax: 150000,
    skills: ['Aerodynamics CFD (ANSYS)', 'MATLAB Flight Controls', 'Propulsion Modeling', 'Structural Stress Analysis', 'Avionics software systems', 'CATIA 3D Design'],
    certifications: ['AIAA Aerospace Certificate', 'ANSYS CFD Certified Professional'],
    marketDemand: 'High'
  },
  {
    title: 'Biotechnology Engineer',
    description: 'Synthesizes bio-molecular processes, genomic algorithms, bioinformatics datasets, medical device interfaces, and drug discovery processes.',
    salaryMin: 65000,
    salaryMax: 115000,
    skills: ['Bioinformatics (BLAST)', 'R/Python Genomic tools', 'Bioprocess Engineering', 'Molecular Modeling', 'FDA regulatory guidelines', 'Lab Simulation software'],
    certifications: ['Certified Bio-Technologist', 'R/Bioconductor Analytical Certificate'],
    marketDemand: 'Medium'
  },
  {
    title: 'Electronics & Communication Engineer (ECE)',
    description: 'Engineers VLSI layout schematics, digital signal processors, telecommunication grids, RF transmitters, and advanced semiconductor technologies.',
    salaryMin: 85000,
    salaryMax: 145000,
    skills: ['Verilog / VHDL', 'VLSI Design (Cadence)', 'Digital Signal Processing (DSP)', 'RF & Antenna theory', 'FPGA Prototyping', 'Circuit simulations (SPICE)'],
    certifications: ['VLSI System Design Academy Certificate', 'IEEE Certified Telecom Professional'],
    marketDemand: 'High'
  },
  {
    title: 'Robotics & Automation Engineer',
    description: 'Synthesizes robotic limbs, computer vision navigation grids, real-time sensory loops, autonomous navigation algorithms, and industrial robotic networks.',
    salaryMin: 85000,
    salaryMax: 140000,
    skills: ['ROS (Robot Operating System)', 'Python/C++', 'Computer Vision (OpenCV)', 'Kinematics & Dynamics', 'SLAM Algorithms', 'PLC & SCADA systems'],
    certifications: ['Certified Robotics specialist (RIA)', 'ROS Developer Certificate'],
    marketDemand: 'High'
  },
  {
    title: 'Materials & Metallurgical Engineer',
    description: 'Investigates the property, crystal structures, extraction, and synthesis of metals, polymers, composites, and high-performance alloys for tech manufacturing.',
    salaryMin: 70000,
    salaryMax: 120000,
    skills: ['Scanning Electron Microscopy', 'X-ray Diffraction (XRD) analysis', 'Alloy Phase Diagrams', 'Mechanical Testing (Tensile)', 'Corrosion Prevention science', 'CAD Modeling'],
    certifications: ['AWS Certified Welding/Materials Professional', 'NACE Corrosion Specialist certification'],
    marketDemand: 'Medium'
  },
  {
    title: 'Industrial & Production Engineer',
    description: 'Optimizes manufacturing workflows, facility layouts, lean operations, industrial supply chains, quality assurances, and human-machine efficiency designs.',
    salaryMin: 75000,
    salaryMax: 125000,
    skills: ['Lean Six Sigma standards', 'Operations Research models', 'Supply Chain ERP packages (SAP)', 'Discrete Event Simulation', 'ISO 9001 systems', 'Facility CAD layouts'],
    certifications: ['Six Sigma Green/Black Belt', 'APICS Certified in Production and Inventory Management (CPIM)'],
    marketDemand: 'High'
  }
];

export default function CareerExplorer({ onAnalyzeCareer }: CareerExplorerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState(CURRENCIES[0]); // Default to INR
  const [selectedCareer, setSelectedCareer] = useState<CareerDetails | null>(DEFAULT_CAREERS[0]);
  
  // Custom user parameters
  const [expectedSalary, setExpectedSalary] = useState<number>(0);
  const [customRate, setCustomRate] = useState<string>(''); // Default empty means use default rate
  const [isFilterByExpectation, setIsFilterByExpectation] = useState<boolean>(false);

  // 10-Minute Market Live Engine state
  const [marketPulse, setMarketPulse] = useState<MarketPulse | null>(null);
  const [countdownSeconds, setCountdownSeconds] = useState<number>(600);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'careers' | 'companies'>('careers');
  const [companySearch, setCompanySearch] = useState<string>('');
  const [selectedSector, setSelectedSector] = useState<string>('All');
  const [selectedCompanyModal, setSelectedCompanyModal] = useState<CompanyProfile | null>(null);

  const fetchMarketPulse = async (showLoading = false) => {
    if (showLoading) setIsSyncing(true);
    try {
      const res = await fetch('/api/market-pulse');
      if (res.ok) {
        const data = await res.json();
        setMarketPulse(data);
        if (typeof data.nextUpdateInSeconds === 'number') {
          setCountdownSeconds(data.nextUpdateInSeconds);
        }
      }
    } catch (err) {
      console.error('Error fetching market pulse:', err);
    } finally {
      if (showLoading) setIsSyncing(false);
    }
  };

  useEffect(() => {
    fetchMarketPulse(false);
  }, []);

  // 1-second countdown ticker for 10-minute auto refresh cycle
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdownSeconds((prev) => {
        if (prev <= 1) {
          fetchMarketPulse(false);
          return 600;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleForceRefresh = async () => {
    setIsSyncing(true);
    try {
      const res = await fetch('/api/market-refresh', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setMarketPulse(data);
        setCountdownSeconds(600);
      }
    } catch (err) {
      console.error('Error force refreshing:', err);
    } finally {
      setIsSyncing(false);
    }
  };

  const formatCountdown = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Helper to resolve currently active currency conversion rate
  const getActiveRate = (currency: typeof CURRENCIES[0]) => {
    if (currency.code === selectedCurrency.code && customRate && !isNaN(parseFloat(customRate))) {
      return parseFloat(customRate);
    }
    return currency.rate;
  };

  const filteredCareers = DEFAULT_CAREERS.filter((c) => {
    // 1. Text Search Filter (title or skills)
    const matchesSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.skills.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase()));
      
    if (!matchesSearch) return false;
    
    // 2. Expected Salary/Compensation Filter (if active)
    if (isFilterByExpectation && expectedSalary > 0) {
      // Find maximum compensation converted to current rate
      const activeRate = getActiveRate(selectedCurrency);
      const convertedMax = c.salaryMax * activeRate;
      
      // Is the career max salary capable of satisfying the expectation?
      if (selectedCurrency.code === 'INR') {
        const salaryInLakhs = convertedMax / 100000;
        return salaryInLakhs >= expectedSalary;
      } else {
        const salaryInThousands = convertedMax / 1000;
        return salaryInThousands >= expectedSalary;
      }
    }
    
    return true;
  });

  const getDemandColor = (demand: 'High' | 'Medium' | 'Low') => {
    switch (demand) {
      case 'High': return 'bg-emerald-950/80 text-emerald-400 border-emerald-900';
      case 'Medium': return 'bg-blue-950/80 text-blue-400 border-blue-900';
      default: return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  const formatSalaryRange = (min: number, max: number, currency: typeof CURRENCIES[0]) => {
    const rate = getActiveRate(currency);
    const minConverted = min * rate;
    const maxConverted = max * rate;
    
    if (currency.code === 'INR') {
      const minLakhs = minConverted / 100000;
      const maxLakhs = maxConverted / 100000;
      return `${currency.symbol}${minLakhs.toFixed(1)}L - ${maxLakhs.toFixed(1)}L`;
    }
    
    return `${currency.symbol}${(minConverted / 1000).toFixed(0)}k - ${currency.symbol}${(maxConverted / 1000).toFixed(0)}k`;
  };

  const formatFullSalary = (amount: number, currency: typeof CURRENCIES[0]) => {
    const rate = getActiveRate(currency);
    const converted = amount * rate;
    if (currency.code === 'INR') {
      const lakhs = converted / 100000;
      return `${currency.symbol}${lakhs.toFixed(2)} Lakhs`;
    }
    return `${currency.symbol}${Math.round(converted).toLocaleString(currency.locale)}`;
  };

  const getCareerIcon = (title: string) => {
    switch (title) {
      case 'AI Engineer': return <Cpu className="w-5.5 h-5.5 text-indigo-400" />;
      case 'Data Scientist': return <Database className="w-5.5 h-5.5 text-indigo-400" />;
      case 'Machine Learning Engineer': return <Cpu className="w-5.5 h-5.5 text-purple-400" />;
      case 'Full Stack Developer': return <Globe className="w-5.5 h-5.5 text-emerald-400" />;
      case 'Frontend Developer': return <Globe className="w-5.5 h-5.5 text-cyan-400" />;
      case 'Backend Developer': return <Server className="w-5.5 h-5.5 text-rose-400" />;
      case 'Mobile App Developer': return <Smartphone className="w-5.5 h-5.5 text-violet-400" />;
      case 'Product Manager': return <Briefcase className="w-5.5 h-5.5 text-amber-400" />;
      case 'UI/UX Designer': return <PenTool className="w-5.5 h-5.5 text-pink-400" />;
      case 'QA / Test Automation Engineer': return <CheckSquare className="w-5.5 h-5.5 text-teal-400" />;
      case 'Data Analyst': return <Database className="w-5.5 h-5.5 text-sky-400" />;
      case 'Cybersecurity Analyst': return <ShieldCheck className="w-5.5 h-5.5 text-rose-400" />;
      case 'Cloud Engineer': return <Cloud className="w-5.5 h-5.5 text-cyan-400" />;
      case 'DevOps Engineer': return <LoopIcon className="w-5.5 h-5.5 text-amber-400" />;
      case 'Blockchain Developer': return <Coins className="w-5.5 h-5.5 text-yellow-400" />;
      case 'Data Engineer': return <Database className="w-5.5 h-5.5 text-blue-400" />;
      case 'Systems Architect': return <Server className="w-5.5 h-5.5 text-indigo-400" />;
      case 'Embedded Systems & IoT Engineer': return <Cpu className="w-5.5 h-5.5 text-amber-500" />;
      case 'Game Developer': return <Terminal className="w-5.5 h-5.5 text-pink-550 mr-0.5" />;
      case 'Electrical Engineer': return <Zap className="w-5.5 h-5.5 text-amber-400" />;
      case 'Mechanical Engineer': return <Wrench className="w-5.5 h-5.5 text-slate-300" />;
      case 'Civil Engineer': return <Building className="w-5.5 h-5.5 text-emerald-400" />;
      case 'Chemical Engineer': return <Beaker className="w-5.5 h-5.5 text-violet-400" />;
      case 'Aerospace Engineer': return <Plane className="w-5.5 h-5.5 text-sky-450" />;
      case 'Biotechnology Engineer': return <Dna className="w-5.5 h-5.5 text-teal-400" />;
      case 'Electronics & Communication Engineer (ECE)': return <Radio className="w-5.5 h-5.5 text-rose-400" />;
      case 'Robotics & Automation Engineer': return <Bot className="w-5.5 h-5.5 text-purple-400" />;
      case 'Materials & Metallurgical Engineer': return <Beaker className="w-5.5 h-5.5 text-cyan-400" />;
      case 'Industrial & Production Engineer': return <TrendingUp className="w-5.5 h-5.5 text-amber-500" />;
      default: return <Compass className="w-5.5 h-5.5 text-slate-400" />;
    }
  };

  const sectorOptions = ['All', 'Cloud, AI & Big Tech', 'Fintech', 'SaaS', 'Semiconductors', 'Automotive & EV', 'Civil Infrastructure', 'Biotech & Pharma', 'Global IT'];

  const filteredCompanies = VERIFIED_COMPANIES.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(companySearch.toLowerCase()) ||
      c.sector.toLowerCase().includes(companySearch.toLowerCase()) ||
      c.featuredRoles.some(r => r.toLowerCase().includes(companySearch.toLowerCase())) ||
      c.locations.some(l => l.toLowerCase().includes(companySearch.toLowerCase()));
    
    if (!matchesSearch) return false;

    if (selectedSector !== 'All') {
      return c.sector.toLowerCase().includes(selectedSector.toLowerCase());
    }
    return true;
  });

  return (
    <div className="flex-1 p-6 overflow-y-auto bg-slate-950 text-slate-100 min-h-screen space-y-6">
      {/* 10-Minute Live Market Sync Banner */}
      <div className="bg-gradient-to-r from-indigo-950/70 via-slate-900 to-slate-900/90 border border-indigo-900/40 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
            <TrendingUp className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-bold text-white text-sm">Live Market & Salary Index</span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-950/80 border border-emerald-800 text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live 10-Min Cycle #{marketPulse?.cycleNumber || 1}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                • {marketPulse?.activeJobsCount || 520}+ Fresher Openings Active
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Verified AmbitionBox ratings, live fresher CTC, and corporate career pages synchronized every 10 minutes.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-center">
          <div className="text-right">
            <span className="text-[9px] uppercase font-mono text-slate-500 font-bold block">Next Auto-Sync</span>
            <span className="text-xs font-mono font-extrabold text-indigo-300 flex items-center gap-1 justify-end">
              <Clock className="w-3.5 h-3.5 text-indigo-400" />
              {formatCountdown(countdownSeconds)}
            </span>
          </div>

          <button
            onClick={handleForceRefresh}
            disabled={isSyncing}
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-[11px] font-bold flex items-center gap-1.5 transition cursor-pointer disabled:opacity-50 shadow-sm"
            title="Force immediate market update"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Syncing...' : 'Sync Now'}</span>
          </button>
        </div>
      </div>

      {/* View Mode Toggle Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-900 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('careers')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              viewMode === 'careers'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-850'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Career Paths ({DEFAULT_CAREERS.length})</span>
          </button>

          <button
            onClick={() => setViewMode('companies')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              viewMode === 'companies'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-850'
            }`}
          >
            <Building className="w-4 h-4" />
            <span>Top Companies & Verified Salaries ({VERIFIED_COMPANIES.length})</span>
            <span className="text-[9px] bg-emerald-950/80 text-emerald-400 border border-emerald-800 px-1.5 py-0.2 rounded-full font-mono">
              Live
            </span>
          </button>
        </div>

        {viewMode === 'careers' && (
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Currency Selector Bar */}
            <div className="bg-slate-900/90 border border-slate-800 p-1 rounded-lg flex items-center gap-1">
              <Coins className="w-3.5 h-3.5 text-slate-500 ml-2 mr-1" />
              {CURRENCIES.map((curr) => (
                <button
                  key={curr.code}
                  onClick={() => {
                    setSelectedCurrency(curr);
                  }}
                  className={`px-2 py-1 rounded text-[10px] font-bold transition-all cursor-pointer ${
                    selectedCurrency.code === curr.code
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                  }`}
                  title={curr.label}
                >
                  {curr.code}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-56 shrink-0">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search careers or skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-850 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-600 transition"
              />
            </div>
          </div>
        )}
      </div>

      {/* VIEW MODE 1: CAREER PATHS */}
      {viewMode === 'careers' && (
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Careers Left Panel */}
          <div className="flex-1 space-y-4">
            {/* Custom Salary & Currency Controls Row */}
            <div className="bg-slate-900/40 border border-slate-850 p-4 rounded-xl space-y-3 font-sans">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-850/60 pb-2">
                <div className="flex items-center gap-2">
                  <Coins className="w-4 h-4 text-emerald-400" />
                  <span className="text-[12px] font-bold text-slate-200">Interactive Salary Adjuster & Exchange Overrides</span>
                </div>
                <div className="text-[11px] text-slate-400 font-mono">
                  Base Price Multiplier: <strong className="text-white">1 USD = {getActiveRate(selectedCurrency)} {selectedCurrency.code}</strong>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                {/* Custom Rate Input */}
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-400 font-mono uppercase block">Set Custom Conversion Rate</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      step="0.01"
                      placeholder={`Default: ${selectedCurrency.rate}`}
                      value={customRate}
                      onChange={(e) => setCustomRate(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-md text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-600 font-mono"
                    />
                    {customRate && (
                      <button 
                        onClick={() => setCustomRate('')} 
                        className="text-[10px] text-rose-400 hover:text-rose-350 font-bold border border-rose-900/60 bg-rose-950/20 px-2 rounded-md transition"
                        title="Reset to official rate"
                      >
                        Reset
                      </button>
                    )}
                  </div>
                </div>

                {/* Target Salary expectation slider filter */}
                <div className="space-y-1 md:col-span-2">
                  <div className="flex justify-between items-center text-[9px] font-bold text-slate-400 font-mono uppercase">
                    <span className="text-indigo-400">Expectation: {expectedSalary > 0 ? `${expectedSalary}${selectedCurrency.code === 'INR' ? ' Lakhs' : 'k'}` : 'Min / Any'}</span>
                    <div className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        id="enableFilter"
                        checked={isFilterByExpectation}
                        onChange={(e) => setIsFilterByExpectation(e.target.checked)}
                        className="rounded bg-slate-950 border-slate-800 text-indigo-600 focus:ring-0 focus:ring-offset-0 w-3.5 h-3.5 cursor-pointer accent-indigo-600"
                      />
                      <label htmlFor="enableFilter" className="cursor-pointer select-none text-slate-300 hover:text-white">Filter by my Target</label>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min="0"
                      max={selectedCurrency.code === 'INR' ? '150' : '250'}
                      value={expectedSalary}
                      onChange={(e) => {
                        setExpectedSalary(Number(e.target.value));
                        setIsFilterByExpectation(true);
                      }}
                      className="w-full accent-indigo-600 bg-slate-950 h-1 rounded-lg border-none"
                    />
                    <span className="text-[11px] font-mono text-slate-300 w-16 shrink-0 text-right">
                      {expectedSalary > 0 ? `${expectedSalary}${selectedCurrency.code === 'INR' ? ' Lakhs' : 'k'}` : '0 USD'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Roles List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {filteredCareers.map((c) => (
                <div
                  key={c.title}
                  onClick={() => setSelectedCareer(c)}
                  className={`p-4 rounded-xl border transition-all duration-150 cursor-pointer flex flex-col justify-between ${
                    selectedCareer?.title === c.title
                      ? 'bg-gradient-to-b from-indigo-950/40 to-slate-900 border-indigo-600/80 shadow-md shadow-indigo-500/5'
                      : 'bg-slate-900/45 border-slate-850 hover:bg-slate-900/85 hover:border-slate-800'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center">
                          {getCareerIcon(c.title)}
                        </div>
                        <h3 className="text-xs font-bold text-white tracking-tight">{c.title}</h3>
                      </div>
                      <span className={`text-[9px] font-mono font-medium px-2 py-0.5 rounded-full border ${getDemandColor(c.marketDemand)}`}>
                        {c.marketDemand} Demand
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-normal line-clamp-2">{c.description}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-950 flex justify-between items-center text-[10px] text-slate-400 font-mono">
                    <span className="flex items-center gap-1 font-semibold text-slate-350 bg-slate-950/35 border border-slate-850/60 py-1 px-2 rounded-md">
                      <Coins className="w-3.5 h-3.5 text-indigo-400" />
                      <span>{formatSalaryRange(c.salaryMin, c.salaryMax, selectedCurrency)}</span>
                    </span>
                    <span className="text-indigo-400 font-semibold group flex items-center gap-1 hover:underline">
                      <span>View Details</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </div>
                </div>
              ))}

              {filteredCareers.length === 0 && (
                <div className="p-8 text-center bg-slate-900/25 border border-slate-900 rounded-xl col-span-2">
                  <p className="text-xs text-slate-500">No matching careers identified in our standard directory.</p>
                  <p className="text-[10px] text-slate-600 mt-1">Try entering a search like 'AI' or 'Cloud DevOps'.</p>
                </div>
              )}
            </div>
          </div>

          {/* Selected Career Details Panel Right Side */}
          {selectedCareer ? (
            <div className="w-full lg:w-96 bg-slate-900/60 border border-slate-850 rounded-2xl p-6 flex flex-col justify-between shrink-0 h-fit space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
                    {getCareerIcon(selectedCareer.title)}
                  </div>
                  <div>
                    <h2 className="text-base font-extrabold text-white leading-tight">{selectedCareer.title}</h2>
                    <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-400">
                      <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded-full border ${getDemandColor(selectedCareer.marketDemand)}`}>
                        {selectedCareer.marketDemand} Demand
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed pt-2">
                  {selectedCareer.description}
                </p>

                {/* Salary Scale */}
                <div className="p-3 bg-slate-950/40 rounded-xl border border-slate-850">
                  <span className="text-[9px] uppercase tracking-wider text-slate-550 font-semibold font-mono block mb-2 text-slate-500">Approximate Base Compensation ({selectedCurrency.code})</span>
                  <div className="flex justify-between items-end">
                    <div>
                      <span className="text-[10px] text-slate-500 font-mono block">Median Low</span>
                      <span className="text-sm font-bold text-slate-350 font-mono">{formatFullSalary(selectedCareer.salaryMin, selectedCurrency)}</span>
                    </div>
                    <div className="flex-1 mx-3 h-1.5 bg-slate-850 rounded-full relative bottom-1.5 overflow-hidden">
                      <div className="absolute left-1/4 right-1/4 h-full bg-gradient-to-r from-indigo-500 to-indigo-400 rounded-full" />
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-500 font-mono block">Median High</span>
                      <span className="text-sm font-bold text-white font-mono">{formatFullSalary(selectedCareer.salaryMax, selectedCurrency)}</span>
                    </div>
                  </div>
                </div>

                {/* Top Hiring Companies & Verified Packages */}
                <div className="space-y-2.5 pt-2 border-t border-slate-850">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-wider text-indigo-400 font-extrabold font-mono flex items-center gap-1.5">
                      <Building className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Top Recruiting Companies & Verified Salaries</span>
                    </span>
                    <span className="text-[9px] text-emerald-400 font-mono font-medium flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Live Verified
                    </span>
                  </div>

                  <div className="space-y-2">
                    {getRecruitersForCareer(selectedCareer.title).map((recruiter, idx) => (
                      <div key={idx} className="p-2.5 bg-slate-950/80 border border-slate-850 rounded-xl space-y-1.5 hover:border-slate-800 transition">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-1.5">
                              <h4 className="text-xs font-bold text-white">{recruiter.name}</h4>
                              <a
                                href={recruiter.ambitionBoxUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[9px] bg-amber-950/60 border border-amber-900 text-amber-400 px-1.5 py-0.2 rounded font-mono hover:border-amber-500 transition"
                                title="View reviews on AmbitionBox"
                              >
                                ★ {recruiter.rating}
                              </a>
                            </div>
                            <span className="text-[9px] text-slate-500 font-sans">{recruiter.location}</span>
                          </div>

                          <a
                            href={recruiter.careersUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[9px] bg-indigo-950/70 border border-indigo-900 text-indigo-300 px-2 py-1 rounded-md font-semibold hover:bg-indigo-900/60 hover:text-white transition flex items-center gap-1"
                          >
                            <span>Apply</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-[10px] font-mono pt-1 border-t border-slate-900">
                          <div>
                            <span className="text-[8.5px] text-slate-500 block">Fresher CTC:</span>
                            <span className="text-emerald-400 font-bold">{recruiter.fresherSalary}</span>
                          </div>
                          <div>
                            <span className="text-[8.5px] text-slate-500 block">Intern Stipend:</span>
                            <span className="text-indigo-300 font-medium">{recruiter.internshipStipend}</span>
                          </div>
                        </div>

                        <div className="text-[8.5px] text-slate-400 flex items-center justify-between">
                          <span className="italic text-indigo-300/80">{recruiter.hiringStatus}</span>
                          <span className="text-[8px] text-slate-500">{recruiter.reviews}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Key Skills */}
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-indigo-400 font-semibold font-mono block mb-2 font-sans">Primary Competency Gaps tested</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedCareer.skills.map((skill) => (
                      <span 
                        key={skill}
                        className="text-[10px] py-1 px-2.5 bg-slate-950 font-medium text-slate-300 rounded-md border border-slate-850/80 hover:border-slate-800 transition"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Recommended Certifications */}
                <div className="space-y-2">
                  <span className="text-[9px] uppercase tracking-wider text-slate-500 font-semibold font-mono block">Highlight Certifications</span>
                  <div className="space-y-1.5">
                    {selectedCareer.certifications.map((cert) => (
                      <div key={cert} className="flex gap-2 p-2 bg-slate-950/20 border border-slate-850/60 rounded-lg">
                        <Award className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
                        <span className="text-[10px] text-slate-400 leading-normal">{cert}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={() => onAnalyzeCareer(selectedCareer.title)}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/10 flex items-center justify-center gap-2 cursor-pointer transition hover:-translate-y-0.5"
              >
                <Sparkles className="w-4 h-4 animate-spin-slow" />
                <span>Map Skill Gap & Roadmap</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="w-full lg:w-96 bg-slate-900/30 border border-slate-900 rounded-2xl p-6 text-center text-slate-500 flex items-center justify-center h-80">
              <p className="text-xs">Select a career track on the left to inspect professional details and trigger tools.</p>
            </div>
          )}
        </div>
      )}

      {/* VIEW MODE 2: TOP COMPANIES & VERIFIED SALARY INDEX */}
      {viewMode === 'companies' && (
        <div className="space-y-5">
          {/* Company Search & Sector Filters */}
          <div className="p-4 bg-slate-900/40 border border-slate-850 rounded-2xl space-y-3">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search by company name, sector, tech stack, or location..."
                  value={companySearch}
                  onChange={(e) => setCompanySearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-600 transition"
                />
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                <span>Displaying: <strong className="text-white">{filteredCompanies.length}</strong> verified companies</span>
              </div>
            </div>

            {/* Sector filter pills */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {sectorOptions.map((sector) => (
                <button
                  key={sector}
                  onClick={() => setSelectedSector(sector)}
                  className={`text-[10px] px-2.5 py-1 rounded-lg font-medium transition cursor-pointer border ${
                    selectedSector === sector
                      ? 'bg-indigo-600 border-indigo-500 text-white font-bold shadow-sm'
                      : 'bg-slate-950/60 border-slate-850 text-slate-400 hover:text-white hover:border-slate-800'
                  }`}
                >
                  {sector}
                </button>
              ))}
            </div>
          </div>

          {/* Companies Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCompanies.map((company) => (
              <div
                key={company.id}
                className="bg-slate-900/50 border border-slate-850 rounded-2xl p-5 flex flex-col justify-between space-y-4 hover:border-slate-800 hover:bg-slate-900/80 transition-all duration-150"
              >
                <div className="space-y-3">
                  {/* Top Company Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-indigo-400 shrink-0 mt-0.5">
                        <Building className="w-5 h-5 text-indigo-400" />
                      </div>
                      <div>
                        <h3 className="text-sm font-extrabold text-white leading-tight">{company.name}</h3>
                        <span className="text-[10px] text-slate-400 font-sans block mt-0.5">{company.sector}</span>
                      </div>
                    </div>

                    {/* AmbitionBox Rating Pill */}
                    <a
                      href={company.ambitionBoxUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[10px] bg-amber-950/50 border border-amber-800/70 hover:border-amber-500 text-amber-400 px-2 py-0.5 rounded-md font-mono shrink-0 transition"
                      title="Verify authentic employee reviews and salaries on AmbitionBox"
                    >
                      <span>★ {company.rating}</span>
                      <span className="text-[8px] text-amber-500/80">({company.reviewsCount})</span>
                      <ExternalLink className="w-2.5 h-2.5 text-amber-400/80" />
                    </a>
                  </div>

                  <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-2">
                    {company.about}
                  </p>

                  {/* Verified Salaries Breakdown Box */}
                  <div className="p-3 bg-slate-950/70 border border-slate-850/80 rounded-xl space-y-2 font-mono">
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="text-slate-500">Fresher CTC:</span>
                      <span className="text-emerald-400 font-extrabold">{company.fresherCtc}</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="text-slate-500">Intern Stipend:</span>
                      <span className="text-indigo-300 font-bold">{company.internStipend}</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] pt-1 border-t border-slate-900">
                      <span className="text-slate-500">Mid-Level (3-5y):</span>
                      <span className="text-slate-300 font-medium">{company.midLevelCtc}</span>
                    </div>
                  </div>

                  {/* Locations & Open Roles */}
                  <div className="flex flex-wrap items-center gap-2 text-[10px]">
                    <span className="px-2 py-0.5 bg-slate-950 border border-slate-850 rounded text-slate-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-rose-400" />
                      <span>{company.locations.slice(0, 2).join(', ')}{company.locations.length > 2 ? ` +${company.locations.length - 2}` : ''}</span>
                    </span>

                    <span className="px-2 py-0.5 bg-indigo-950/60 border border-indigo-900/60 rounded text-indigo-300 font-mono flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span>{company.openRolesCount} Open Vacancies</span>
                    </span>
                  </div>

                  {/* Featured Roles */}
                  <div className="space-y-1">
                    <span className="text-[9px] uppercase tracking-wider text-slate-500 font-mono block">Recruiting For</span>
                    <div className="flex flex-wrap gap-1">
                      {company.featuredRoles.map(role => (
                        <span key={role} className="text-[9px] px-2 py-0.5 bg-slate-950/80 border border-slate-850 rounded text-slate-300">
                          {role}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Actions: View Details & Apply on Career Page */}
                <div className="pt-2 border-t border-slate-900 flex items-center gap-2">
                  <button
                    onClick={() => setSelectedCompanyModal(company)}
                    className="flex-1 py-2 px-3 bg-slate-950 hover:bg-slate-850 border border-slate-800 text-slate-300 rounded-xl text-xs font-semibold transition cursor-pointer text-center"
                  >
                    View Details
                  </button>

                  <a
                    href={company.directCareersUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2 px-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    <span>Careers Page</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Selected Company Modal */}
      {selectedCompanyModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 space-y-5">
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                  <Building className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white leading-tight">{selectedCompanyModal.name}</h3>
                  <span className="text-xs text-slate-400">{selectedCompanyModal.sector} • {selectedCompanyModal.headquarters}</span>
                </div>
              </div>

              <button
                onClick={() => setSelectedCompanyModal(null)}
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* AmbitionBox Rating & Hiring Batch */}
            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                <span className="text-[10px] text-slate-500 uppercase block mb-1">AmbitionBox Rating</span>
                <a
                  href={selectedCompanyModal.ambitionBoxUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-400 font-bold flex items-center gap-1 hover:underline"
                >
                  ★ {selectedCompanyModal.rating} ({selectedCompanyModal.reviewsCount}) ↗
                </a>
              </div>

              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                <span className="text-[10px] text-slate-500 uppercase block mb-1">Hiring Batch Target</span>
                <span className="text-emerald-400 font-bold">{selectedCompanyModal.hiringBatch}</span>
              </div>
            </div>

            {/* Complete Compensation Breakdown */}
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2.5 font-mono text-xs">
              <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider block">Verified Salary Benchmarks</span>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-slate-500 text-[10px] block">Fresher / Graduate CTC:</span>
                  <span className="text-emerald-400 font-bold text-sm">{selectedCompanyModal.fresherCtc}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">Internship Monthly Stipend:</span>
                  <span className="text-indigo-300 font-bold text-sm">{selectedCompanyModal.internStipend}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">Mid-Level (3-5 yrs):</span>
                  <span className="text-slate-300 font-medium">{selectedCompanyModal.midLevelCtc}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">Senior / Lead (6+ yrs):</span>
                  <span className="text-slate-300 font-medium">{selectedCompanyModal.seniorCtc}</span>
                </div>
              </div>
            </div>

            {/* About & Culture */}
            <div className="space-y-2 text-xs text-slate-300">
              <span className="text-[10px] font-bold text-slate-500 uppercase font-mono block">Workplace Culture & Insights</span>
              <p className="leading-relaxed text-slate-400">{selectedCompanyModal.workCulture}</p>
            </div>

            {/* Perks & Benefits */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase font-mono block">Verified Employee Perks</span>
              <div className="flex flex-wrap gap-1.5">
                {selectedCompanyModal.benefits.map((benefit, bIdx) => (
                  <span key={bIdx} className="text-[11px] px-2.5 py-1 bg-slate-950 border border-slate-800 rounded-lg text-slate-300 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-indigo-400" />
                    <span>{benefit}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-3 border-t border-slate-800 flex gap-3">
              <a
                href={selectedCompanyModal.ambitionBoxUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-4 bg-slate-950 hover:bg-slate-850 border border-slate-800 text-amber-400 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
              >
                <span>Read AmbitionBox Reviews</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              <a
                href={selectedCompanyModal.directCareersUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/20"
              >
                <span>Apply on Official Careers Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
