import { useCallback, useEffect, useState, type FormEvent } from "react";
import type { Profile } from "./types";
import "./App.css";

function Header({ name }: { name: string }) {
  return (
    <header className="site-header">
      <div className="inner">
        <a className="brand" href="#top">
          {name}
        </a>
        <nav className="nav" aria-label="Primary">
          <a href="#about">About</a>
          <a href="#experience">Experience</a>
          <a href="#skills">Skills</a>
          <a href="#projects">Projects</a>
          <a href="#education">Education</a>
          <a href="#achievements">Achievements</a>
          <a href="#contact">Contact</a>
        </nav>
      </div>
    </header>
  );
}

function Hero({ profile }: { profile: Profile }) {
  return (
    <section className="hero" id="top">
      <div className="hero-inner">
        <div className="hero-copy">
          <div className="hero-pill" aria-hidden>
            <span>Node.js · TypeScript · PostgreSQL · Express</span>
          </div>
          <h1>{profile.title}</h1>
          <p className="tagline">{profile.tagline}</p>
          <p className="hero-location">
            <svg aria-hidden className="hero-location-icon" viewBox="0 0 24 24" fill="none">
              <path
                d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 1 1 18 0z"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
              <circle cx="12" cy="10" fill="none" r="3" stroke="currentColor" strokeWidth="2" />
            </svg>
            {profile.location}
          </p>
          <div className="hero-actions">
            <a className="btn btn-primary" href="#contact">
              Get in touch
            </a>
            <a className="btn btn-ghost" href="#projects">
              View projects
            </a>
          </div>
        </div>
        <div className="hero-visual">
          <figure className="hero-photo-frame">
            <img
              alt={profile.name}
              className="hero-photo"
              decoding="async"
              height="400"
              src="/profile-photo.png"
              width="320"
            />
          </figure>
        </div>
      </div>
    </section>
  );
}

function About({ profile }: { profile: Profile }) {
  return (
    <section id="about">
      <h2>About</h2>
      <div className="card-grid two">
        <div className="card">
          <h3>Overview</h3>
          <p>
            {profile.yearsExperience}+ years shipping backend systems at the intersection of APIs, SQL, and production
            operations—currently building data infrastructure for crypto and AI-driven products.
          </p>
        </div>
        <div className="card">
          <h3>Focus areas</h3>
          <ul className="highlights">
            {profile.highlights.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function ExperienceSection({ profile }: { profile: Profile }) {
  return (
    <section id="experience">
      <h2>Experience</h2>
      <div className="experience-list">
        {profile.experience.map((job) => (
          <article className="card experience-card" key={job.company}>
            <div className="job-header">
              <div>
                <h3>{job.company}</h3>
                <p className="job-role">
                  {job.role} · <span className="job-period">{job.period}</span>
                </p>
              </div>
            </div>
            <div className="job-company-intro">
              <p className="job-intro-eyebrow">Company overview</p>
              <p className="job-company-intro-text">{job.summary}</p>
            </div>
            <h4 className="job-subheading">Roles & responsibilities</h4>
            <ul className="role-bullets">
              {job.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}

function Skills({ profile }: { profile: Profile }) {
  return (
    <section id="skills">
      <h2>Technical skills</h2>
      <div className="card skill-card-wide">
        <div className="skill-groups-grid">
          {profile.skillGroups.map((g) => (
            <div className="skill-group" key={g.title}>
              <h3>{g.title}</h3>
              <div className="tags">
                {g.items.map((t) => (
                  <span className="tag" key={t}>
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Projects({ profile }: { profile: Profile }) {
  return (
    <section id="projects">
      <h2>Projects</h2>
      <div className="card-grid projects">
        {profile.projects.map((p) => (
          <article className="card project-card" key={p.name}>
            <h3>{p.name}</h3>
            <p>{p.description}</p>
            <div className="tags stack">
              {p.stack.map((s) => (
                <span className="tag" key={s}>
                  {s}
                </span>
              ))}
            </div>
            {p.link ? (
              <a className="project-link" href={p.link} rel="noreferrer" target="_blank">
                Visit site →
              </a>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}

function EducationSection({ profile }: { profile: Profile }) {
  return (
    <section id="education">
      <h2>Education</h2>
      <div className="card-grid two">
        {profile.education.map((e) => (
          <article className="card education-card" key={e.institution + e.period}>
            <h3>{e.credential}</h3>
            <p className="education-school">{e.institution}</p>
            <p className="education-meta">
              {e.location} · {e.period}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

function AchievementsSection({ profile }: { profile: Profile }) {
  return (
    <section id="achievements">
      <h2>Achievements</h2>
      <div className="card">
        <ul className="achievement-list">
          {profile.achievements.map((a) => (
            <li key={a}>{a}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Contact({ profile }: { profile: Profile }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "err">("idle");
  const [errText, setErrText] = useState("");

  const submit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      setStatus("sending");
      setErrText("");
      try {
        const res = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, message }),
        });
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        if (!res.ok) {
          setStatus("err");
          setErrText(data.error ?? "Something went wrong");
          return;
        }
        setStatus("ok");
        setName("");
        setEmail("");
        setMessage("");
      } catch {
        setStatus("err");
        setErrText("Network error — is the API running?");
      }
    },
    [name, email, message],
  );

  return (
    <section id="contact">
      <h2>Contact</h2>
      <div className="contact-layout">
        <div className="card">
          <h3>Direct</h3>
          <div className="contact-links">
            <a href={`tel:${profile.social.phoneTel}`}>{profile.social.phoneDisplay}</a>
            <a href={`mailto:${profile.social.email}`}>{profile.social.email}</a>
            <a href={profile.social.github} rel="noreferrer" target="_blank">
              GitHub
            </a>
            <a href={profile.social.linkedin} rel="noreferrer" target="_blank">
              LinkedIn
            </a>
          </div>
        </div>
        <div className="card">
          <h3>Message</h3>
          <form className="form" onSubmit={submit}>
            <label>
              Name
              <input
                autoComplete="name"
                name="name"
                onChange={(e) => setName(e.target.value)}
                required
                value={name}
              />
            </label>
            <label>
              Email
              <input
                autoComplete="email"
                name="email"
                onChange={(e) => setEmail(e.target.value)}
                required
                type="email"
                value={email}
              />
            </label>
            <label>
              Message
              <textarea
                name="message"
                onChange={(e) => setMessage(e.target.value)}
                required
                value={message}
              />
            </label>
            <button className="btn btn-primary" disabled={status === "sending"} type="submit">
              {status === "sending" ? "Sending…" : "Send"}
            </button>
            {status === "ok" ? <p className="form-status ok">Thanks — your message was received.</p> : null}
            {status === "err" ? <p className="form-status err">{errText}</p> : null}
          </form>
        </div>
      </div>
    </section>
  );
}

export default function App() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const res = await fetch("/api/profile");
        if (!res.ok) throw new Error("Failed to load profile");
        const data = (await res.json()) as Profile;
        if (!cancelled) setProfile(data);
      } catch {
        if (!cancelled) setError("Could not load profile. Start the API with npm run dev:server.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (error) {
    return (
      <div className="app">
        <p className="error-banner">{error}</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="app">
        <p className="loading">Loading…</p>
      </div>
    );
  }

  return (
    <div className="app">
      <Header name={profile.name} />
      <main className="shell">
        <Hero profile={profile} />
        <About profile={profile} />
        <ExperienceSection profile={profile} />
        <Skills profile={profile} />
        <Projects profile={profile} />
        <EducationSection profile={profile} />
        <AchievementsSection profile={profile} />
        <Contact profile={profile} />
      </main>
      <footer className="site-footer">
        © {new Date().getFullYear()} {profile.name}. Node.js, Express, React, TypeScript.
      </footer>
    </div>
  );
}
