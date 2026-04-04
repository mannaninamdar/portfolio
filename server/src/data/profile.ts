export const profile = {
  name: "Mannan",
  title: "Node.js Developer",
  tagline:
    "Backend engineer focused on reliable APIs, data, and production-ready Node.js services.",
  yearsExperience: 3,
  location: "Available remotely",
  highlights: [
    "3+ years building and shipping Node.js applications",
    "Strong SQL: schema design, query optimization, and data modeling",
    "REST APIs, integrations, and pragmatic system design",
  ],
  skills: {
    languages: ["JavaScript", "TypeScript", "SQL"],
    backend: ["Node.js", "Express", "REST APIs"],
    data: ["PostgreSQL", "MySQL", "query tuning", "migrations"],
    tooling: ["Git", "Docker", "testing", "CI basics"],
  },
  projects: [
    {
      name: "API & data layer",
      description:
        "Design and implementation of REST services with validated inputs, structured logging, and SQL-backed persistence.",
      stack: ["Node.js", "TypeScript", "SQL"],
      link: null as string | null,
    },
    {
      name: "Integration workflows",
      description:
        "Reliable background jobs and third-party integrations with retries, idempotency, and clear error handling.",
      stack: ["Node.js", "queues", "webhooks"],
      link: null as string | null,
    },
    {
      name: "Your next project",
      description:
        "Replace this card with a real repo, case study, or live demo. The content is driven from the server API.",
      stack: ["Add", "your", "stack"],
      link: null as string | null,
    },
  ],
  social: {
    github: "https://github.com/mannaninamdar",
    linkedin: "https://www.linkedin.com/in/mannan-inamdar-42422816a/",
    email: "mannaninamdar@gmail.com",
  },
} as const;
