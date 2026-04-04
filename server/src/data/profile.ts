import { computeYearsExperience } from "../lib/yearsExperience.js";

const profileCore = {
  name: "Mannan Inamdar",
  title: "Node.js Developer",
  location: "Pune, India",
  highlights: [
    "Scalable REST APIs in Node.js and TypeScript",
    "Cron jobs, pipelines, and high-volume data ingestion",
    "JWT auth, production on-call, and LLM-powered product features",
  ],
  skillGroups: [
    { title: "Languages", items: ["JavaScript", "TypeScript", "SQL"] },
    { title: "Frameworks", items: ["Express.js", "Sequelize ORM"] },
    { title: "Databases", items: ["PostgreSQL", "ClickHouse"] },
    {
      title: "Dev tools",
      items: ["VS Code", "Git", "Postman", "Docker", "Metabase", "ESLint"],
    },
    { title: "AWS", items: ["EC2", "S3", "IAM", "CloudWatch"] },
    {
      title: "AI tools",
      items: ["Cursor", "ChatGPT", "Antigravity", "GitHub Copilot"],
    },
  ],
  experience: [
    {
      company: "DappLooker AI",
      role: "Node.js Backend Developer",
      period: "Apr 2023 – Present",
      summary:
        "Unified data layer for autonomous agents—real-time, structured crypto intelligence for AI agents, DeFi trading systems, staking analyzers, and risk management tools.",
      bullets: [
        "Designed and implemented scalable REST APIs using Node.js and TypeScript",
        "Built cron jobs for automated data processing and scheduled workflows",
        "Integrated third-party services to fetch, process, and store large volumes of data efficiently",
        "Implemented JWT-based authentication and authorization for secure login and access control",
        "On-call production support, debugging, and reliability for live systems",
        "LLM integrations for AI-driven features and automation",
      ],
    },
  ],
  education: [
    {
      institution: "NBN Sinhgad College of Engineering",
      location: "Solapur, Maharashtra, India",
      credential: "Bachelor of Mechanical Engineering",
      period: "June 2017 – May 2020",
    },
    {
      institution: "Indira Institute of Diploma Engineering",
      location: "Solapur, Maharashtra, India",
      credential: "Diploma in Mechanical Engineering",
      period: "June 2013 – May 2016",
    },
  ],
  achievements: [
    "2nd prize — Global Web3 Ecosystem category, ETHIndia Hackathon 2023 (best use of an existing subgraph).",
    "Winner — Week 24 On-Chain Analytics Contest for the Betswirl betting project.",
  ],
  projects: [
    {
      name: "HyprEarn",
      description:
        "One-click trading on Hyperliquid DEX with LLM-generated trade suggestions. Referral rewards and points programs with schema design, REST APIs, caching, and cron-based reward distribution—optimized for real-time trading data.",
      stack: ["Node.js", "TypeScript", "PostgreSQL", "Express", "LLM", "Caching"],
      link: "https://hyprearn.com",
    },
    {
      name: "DappLooker AI (platform)",
      description:
        "Large-scale integrations from APIs, blockchain nodes, and indexers into a unified data layer. Ingestion pipelines, cron workflows for continuous sync, and reliable high-throughput backend processing.",
      stack: ["Node.js", "TypeScript", "PostgreSQL", "REST APIs", "Data pipelines"],
      link: "https://dapplooker.com",
    },
  ],
  social: {
    phoneDisplay: "+91 7757 826 486",
    phoneTel: "+917757826486",
    github: "https://github.com/mannaninamdar",
    linkedin: "https://www.linkedin.com/in/mannan-inamdar-42422816a/",
    email: "mannaninamdar@gmail.com",
  },
} as const;

const TAGLINE_TEMPLATE =
  "Results-driven backend engineer with {{years}}+ years building scalable Node.js systems using JavaScript, TypeScript, and SQL. Strong with Express.js, PostgreSQL, and Sequelize—REST APIs, third-party integrations, and data-driven architecture—with a performance-focused, analytical mindset from a data analysis background.";

export function getProfileForApi(now: Date = new Date()) {
  const yearsExperience = computeYearsExperience(now);
  return {
    ...profileCore,
    yearsExperience,
    tagline: TAGLINE_TEMPLATE.replace("{{years}}", String(yearsExperience)),
  };
}
