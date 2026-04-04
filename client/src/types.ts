export type Project = {
  name: string;
  description: string;
  stack: readonly string[];
  link: string | null;
};

export type SkillGroup = {
  title: string;
  items: readonly string[];
};

export type Job = {
  company: string;
  role: string;
  period: string;
  summary: string;
  bullets: readonly string[];
};

export type EducationEntry = {
  institution: string;
  location: string;
  credential: string;
  period: string;
};

export type Profile = {
  name: string;
  title: string;
  tagline: string;
  yearsExperience: number;
  location: string;
  highlights: readonly string[];
  skillGroups: readonly SkillGroup[];
  experience: readonly Job[];
  education: readonly EducationEntry[];
  achievements: readonly string[];
  projects: readonly Project[];
  social: {
    phoneDisplay: string;
    phoneTel: string;
    github: string;
    linkedin: string;
    email: string;
  };
};
