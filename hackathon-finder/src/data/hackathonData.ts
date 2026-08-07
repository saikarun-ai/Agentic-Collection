export interface Hackathon {
  id: string;
  name: string;
  organizer: string;
  date: string;
  location: string;
  type: 'In-Person' | 'Virtual' | 'Hybrid';
  prizePool: string;
  themes: string[];
  description: string;
  link: string;
  difficulty: 'Beginner Friendly' | 'Intermediate' | 'Advanced';
}

export interface Teammate {
  id: string;
  name: string;
  role: string;
  skills: string[];
  interests: string[];
  avatar: string;
  availability: string;
}

export interface RealProject {
  id: string;
  title: string;
  description: string;
  skillsNeeded: string[];
  hackathonId: string;
  framework: string;
}

export const REAL_HACKATHONS: Hackathon[] = [
  {
    id: "ethglobal-london-2026",
    name: "ETHGlobal London 2026",
    organizer: "ETHGlobal",
    date: "March 13 - 15, 2026",
    location: "London, United Kingdom",
    type: "In-Person",
    prizePool: "$425,000",
    themes: ["Web3", "Blockchain", "DeFi", "Smart Contracts"],
    description: "ETHGlobal London gathers hackers and creators from around the world to build Web3 applications using Ethereum and local L2 scaling protocols.",
    link: "https://ethglobal.com",
    difficulty: "Advanced"
  },
  {
    id: "hackmit-2026",
    name: "HackMIT 2026",
    organizer: "MIT",
    date: "September 19 - 20, 2026",
    location: "Cambridge, Massachusetts",
    type: "Hybrid",
    prizePool: "$30,000",
    themes: ["AI/ML", "Education", "Healthcare", "Web Dev"],
    description: "MIT's premier annual hackathon for undergraduates, hosting over 1,000 developers from all backgrounds to solve high-impact, real-world issues.",
    link: "https://hackmit.org",
    difficulty: "Beginner Friendly"
  },
  {
    id: "treehacks-2026",
    name: "TreeHacks 2026",
    organizer: "Stanford University",
    date: "February 13 - 15, 2026",
    location: "Stanford, California",
    type: "In-Person",
    prizePool: "$150,000",
    themes: ["AI/ML", "Healthcare", "Sustainability", "Fintech"],
    description: "Stanford's premier national hackathon where hackers from across the country congregate to engineer projects that solve global problems.",
    link: "https://www.treehacks.com",
    difficulty: "Intermediate"
  },
  {
    id: "calhacks-13",
    name: "CalHacks 13.0",
    organizer: "UC Berkeley",
    date: "October 16 - 18, 2026",
    location: "Berkeley, California",
    type: "In-Person",
    prizePool: "$100,000",
    themes: ["AI/ML", "Web Dev", "Security", "AR/VR"],
    description: "The world's largest collegiate hackathon hosted at UC Berkeley, featuring a massive crowd of creators focused on AI agent architectures and web tooling.",
    link: "https://calhacks.io",
    difficulty: "Intermediate"
  },
  {
    id: "hackny-2026",
    name: "hackNY Fall Hackathon 2026",
    organizer: "hackNY",
    date: "October 10 - 11, 2026",
    location: "New York City, NY",
    type: "In-Person",
    prizePool: "$15,000",
    themes: ["Web Dev", "Infrastructure", "Open Source", "Civic Tech"],
    description: "Bringing together talented student builders from the Northeast to create community projects, developer infrastructure, and explore NYC's tech scene.",
    link: "https://hackny.org",
    difficulty: "Beginner Friendly"
  },
  {
    id: "ai-agents-global-2026",
    name: "Global AI Agents Swarm Hackathon",
    organizer: "You-AI & Agent-Reach Alliance",
    date: "November 5 - 15, 2026",
    location: "Virtual",
    type: "Virtual",
    prizePool: "$50,000",
    themes: ["AI Agents", "MCP", "Web Scraping", "Automation"],
    description: "A collaborative global hackathon focusing on autonomous multi-agent pipelines, MCP tools, and integration with local & cloud AI models.",
    link: "https://github.com/Panniantong/agent-reach",
    difficulty: "Advanced"
  }
];

export const REAL_TEAMMATES: Teammate[] = [
  {
    id: "tm-1",
    name: "Arjun Mehta",
    role: "AI Agent Engineer",
    skills: ["Python", "LangChain", "MCP Servers", "PyTorch"],
    interests: ["Multi-Agent Swarms", "Information Retrieval", "Autonomous Workflows"],
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=arjun",
    availability: "15 hrs/week"
  },
  {
    id: "tm-2",
    name: "Sophie Chen",
    role: "Frontend Architect",
    skills: ["React", "TypeScript", "Tailwind CSS", "Vite", "D3.js"],
    interests: ["Interactive Visualizations", "UI/UX", "Data Dashboards"],
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=sophie",
    availability: "20 hrs/week"
  },
  {
    id: "tm-3",
    name: "Yusuf Al-Fayed",
    role: "Full-Stack Developer",
    skills: ["Node.js", "Express", "SQLite", "PostgreSQL", "Docker"],
    interests: ["API Development", "MCP standard hosts", "Database Optimization"],
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=yusuf",
    availability: "10 hrs/week"
  },
  {
    id: "tm-4",
    name: "Elena Rostova",
    role: "Product Designer & Researcher",
    skills: ["Figma", "User Research", "Wireframing", "Web scraping"],
    interests: ["UX Analysis", "Study Buddy systems", "AI Persona engineering"],
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=elena",
    availability: "12 hrs/week"
  }
];

export const REAL_PROJECTS: RealProject[] = [
  {
    id: "proj-1",
    title: "SwarmDoc - 6-Agent Document Auditor",
    description: "An automated document review platform built on You-AI's 6-agent swarm pipeline. The Orchestrator delegates sections, the Researcher fetches real-time citations with Agent-Reach, Analysts argue pros/cons, the Critic checks logic, and the Synthesizer compiles the feedback.",
    skillsNeeded: ["Python", "React", "Agent Orchestration"],
    hackathonId: "hackmit-2026",
    framework: "You-AI 6-Agent Swarm"
  },
  {
    id: "proj-2",
    title: "Reach-Map: Interactive Citation & Web Knowledge Graph",
    description: "An interactive paperscape-style search engine that maps arXiv citation graphs and connects web searches using Jina Reader & Exa via Agent-Reach, exposing data nodes safely via standard MCP (Model Context Protocol).",
    skillsNeeded: ["D3.js", "TypeScript", "MCP Standards"],
    hackathonId: "ai-agents-global-2026",
    framework: "Agent-Reach + MCP"
  },
  {
    id: "proj-3",
    title: "CollaBuild Web Sandbox",
    description: "A developer environment implementing the 9-stage multi-agent pipeline (Paper Analysis → SRS → Design → SDLC → Code → QA) to turn finished research papers into operational code prototypes.",
    skillsNeeded: ["TypeScript", "Node.js", "Vite", "Docker"],
    hackathonId: "calhacks-13",
    framework: "CollaBuild Engine"
  }
];
