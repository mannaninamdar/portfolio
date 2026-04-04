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
          <a href="#skills">Skills</a>
          <a href="#projects">Projects</a>
          <a href="#contact">Contact</a>
        </nav>
      </div>
    </header>
  );
}

function Hero({ profile }: { profile: Profile }) {
  return (
    <section className="hero" id="top">
      <div className="hero-pill" aria-hidden>
        <span>Node.js · TypeScript · SQL</span>
      </div>
      <h1>
        {profile.name} — {profile.title}
      </h1>
      <p className="tagline">{profile.tagline}</p>
      <div className="hero-actions">
        <a className="btn btn-primary" href="#contact">
          Get in touch
        </a>
        <a className="btn btn-ghost" href="#projects">
          View work
        </a>
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
          <h3>Experience</h3>
          <p>
            {profile.yearsExperience}+ years shipping backend systems with Node.js, with a strong focus on
            data integrity and SQL.
          </p>
        </div>
        <div className="card">
          <h3>How I work</h3>
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

function Skills({ profile }: { profile: Profile }) {
  const groups = [
    { title: "Languages", items: profile.skills.languages },
    { title: "Backend", items: profile.skills.backend },
    { title: "Data", items: profile.skills.data },
    { title: "Tooling", items: profile.skills.tooling },
  ] as const;
  return (
    <section id="skills">
      <h2>Skills</h2>
      <div className="card">
        {groups.map((g) => (
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
                Open link →
              </a>
            ) : null}
          </article>
        ))}
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
          <p style={{ color: "var(--muted)", marginTop: 0 }}>
            Prefer email or socials? Update these in <code>server/src/data/profile.ts</code>.
          </p>
          <div className="contact-links">
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
            {status === "ok" ? (
              <p className="form-status ok">Thanks — your message was received.</p>
            ) : null}
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
        <Skills profile={profile} />
        <Projects profile={profile} />
        <Contact profile={profile} />
      </main>
      <footer className="site-footer">
        © {new Date().getFullYear()} {profile.name}. Built with Node.js, Express, React, and TypeScript.
      </footer>
    </div>
  );
}
