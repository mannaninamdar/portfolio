import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import path from "path";
import { fileURLToPath } from "url";
import { profile } from "./data/profile.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const isProd = process.env.NODE_ENV === "production";

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
  res.json(profile);
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

const clientDist = path.resolve(__dirname, "../../client/dist");
if (isProd) {
  app.use(express.static(clientDist));
  app.get("*", (_req, res) => {
    res.sendFile(path.join(clientDist, "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
