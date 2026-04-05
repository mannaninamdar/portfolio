import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import path from "path";
import { fileURLToPath } from "url";
import { existsSync } from "fs";
import { getProfileForApi } from "./data/profile.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isProd = process.env.NODE_ENV === "production";

function resolveStaticRoot(): string {
  const envRoot = process.env.STATIC_ROOT?.trim();
  if (envRoot) {
    const resolved = path.resolve(envRoot);
    if (existsSync(path.join(resolved, "index.html"))) return resolved;
    console.warn(`[static] STATIC_ROOT=${envRoot} has no index.html; trying defaults.`);
  }

  // Prefer paths next to compiled server (dist/server → repo root). Works on EC2/PM2
  // even when process.cwd() is / or $HOME (common with systemd).
  const fromApp = [
    path.resolve(__dirname, "../../public"),
    path.resolve(__dirname, "../../client/dist"),
  ];
  for (const dir of fromApp) {
    if (existsSync(path.join(dir, "index.html"))) return dir;
  }

  const fromCwd = [
    path.join(process.cwd(), "public"),
    path.join(process.cwd(), "client/dist"),
  ];
  for (const dir of fromCwd) {
    if (existsSync(path.join(dir, "index.html"))) return dir;
  }

  const fallback = path.resolve(__dirname, "../../public");
  console.error(
    `[static] No index.html found. Deploy the Vite build (public/ or client/dist/) beside dist/server, or set STATIC_ROOT. cwd=${process.cwd()} tried: ${[...fromApp, ...fromCwd].join(" | ")}`,
  );
  return fallback;
}

export const app = express();

if (isProd) {
  app.set("trust proxy", 1);
}

app.use(
  helmet({
    contentSecurityPolicy: isProd ? undefined : false,
  }),
);
app.use(cors({ origin: isProd ? false : true }));
app.use(express.json({ limit: "32kb" }));

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
});

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.get("/api/profile", (_req, res) => {
  res.json(getProfileForApi());
});

app.post("/api/contact", contactLimiter, (req, res) => {
  const { name, email, message } = req.body ?? {};
  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof message !== "string"
  ) {
    return res.status(400).json({ error: "name, email, and message are required" });
  }
  const trimmed = {
    name: name.trim(),
    email: email.trim(),
    message: message.trim(),
  };
  if (!trimmed.name || !trimmed.email || !trimmed.message) {
    return res.status(400).json({ error: "fields cannot be empty" });
  }
  if (trimmed.name.length > 120 || trimmed.email.length > 254 || trimmed.message.length > 4000) {
    return res.status(400).json({ error: "field too long" });
  }
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed.email);
  if (!emailOk) {
    return res.status(400).json({ error: "invalid email" });
  }

  if (process.env.CONTACT_WEBHOOK_URL) {
    void fetch(process.env.CONTACT_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(trimmed),
    }).catch(() => {});
  } else {
    console.info("[contact]", trimmed);
  }

  res.json({ ok: true });
});

const staticRoot = resolveStaticRoot();
if (isProd) {
  if (existsSync(path.join(staticRoot, "index.html"))) {
    console.info(`[static] ${staticRoot}`);
  }
  app.use(express.static(staticRoot));
  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticRoot, "index.html"));
  });
}
