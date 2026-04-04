import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";
import { defineConfig } from "vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  root: __dirname,
  resolve: {
    alias: { "@": path.join(__dirname, "src") },
  },
  publicDir: path.join(__dirname, "public"),
  build: {
    outDir: path.join(__dirname, "dist"),
    emptyDirBeforeWrite: true,
  },
  server: {
    port: 5173,
    proxy: {
      "/api": { target: "http://127.0.0.1:3000", changeOrigin: true },
    },
  },
});
