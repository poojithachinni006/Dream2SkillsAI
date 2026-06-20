/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
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
  Bot
} from 'lucide-react';
import { CareerDetails } from '../types';

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

  return (
    <div className="flex-1 p-6 overflow-y-auto bg-slate-950 text-slate-100 flex flex-col lg:flex-row gap-6 min-h-screen">
      {/* Careers Left Panel */}
      <div className="flex-1 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-900">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              <Compass className="w-5 h-5 text-indigo-500" />
              <span>Standard Support Trajectories</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Explore standard high-demand positions and inspect details</p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
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
        </div>

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
  );
}
