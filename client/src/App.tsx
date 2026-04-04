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
          <p className="copy-justified">
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
            <p className="copy-justified">{p.description}</p>
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
            <a className="contact-link" href={`tel:${profile.social.phoneTel}`}>
              <svg aria-hidden className="contact-icon" viewBox="0 0 24 24" fill="none">
                <path
                  d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.86.3 1.7.63 2.49a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.79.33 1.64.51 2.49.63A2 2 0 0 1 22 16.92z"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
              </svg>
              <span>{profile.social.phoneDisplay}</span>
            </a>
            <a className="contact-link" href={`mailto:${profile.social.email}`}>
              <svg aria-hidden className="contact-icon" viewBox="0 0 24 24" fill="none">
                <path
                  d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
                <path d="m22 6-10 7L2 6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
              <span>{profile.social.email}</span>
            </a>
            <a className="contact-link" href={profile.social.github} rel="noreferrer" target="_blank">
              <svg aria-hidden className="contact-icon contact-icon-fill" viewBox="0 0 24 24">
                <path
                  d="M12 2C6.477 2 2 6.477 2 12c0 4.419 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.113-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.578 9.578 0 0 1 12 6.836a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.748-1.027 2.748-1.027.546 1.379.202 2.398.1 2.651.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.918.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .268.18.58.688.482A10.001 10.001 0 0 0 22 12c0-5.523-4.477-10-10-10z"
                  fill="currentColor"
                />
              </svg>
              <span>GitHub</span>
            </a>
            <a className="contact-link" href={profile.social.linkedin} rel="noreferrer" target="_blank">
              <svg aria-hidden className="contact-icon contact-icon-fill" viewBox="0 0 24 24">
                <path
                  d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 4.126 0 2.062 2.062 0 0 1-2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
                  fill="currentColor"
                />
              </svg>
              <span>LinkedIn</span>
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
