export type Project = {
  name: string;
  description: string;
  stack: readonly string[];
  link: string | null;
};

export type Profile = {
  name: string;
  title: string;
  tagline: string;
  yearsExperience: number;
  location: string;
  highlights: readonly string[];
  skills: {
    languages: readonly string[];
    backend: readonly string[];
    data: readonly string[];
    tooling: readonly string[];
  };
  projects: readonly Project[];
  social: {
    github: string;
    linkedin: string;
    email: string;
  };
};
