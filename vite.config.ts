import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

const resolveGithubPagesBase = () => {
  const explicitBase = process.env.VITE_BASE_PATH;
  if (explicitBase) return explicitBase;

  const repositoryName = process.env.GITHUB_REPOSITORY?.split("/").at(1);
  if (repositoryName) return `/${repositoryName}/`;

  return "/";
};

export default defineConfig(({ command }) => {
  const hasSupabaseConfig = Boolean(process.env.VITE_SUPABASE_URL && process.env.VITE_SUPABASE_PUBLISHABLE_KEY);
  const authMode = process.env.VITE_AUTH_MODE || (hasSupabaseConfig ? "supabase" : (command === "serve" ? "server" : "demo"));
  return {
    base: authMode === "server" ? "/" : resolveGithubPagesBase(),
    define: {
      "import.meta.env.VITE_AUTH_MODE": JSON.stringify(authMode),
    },
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "."),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== "true",
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === "true" ? null : {},
      proxy: {
        "/api": "http://localhost:8080",
      },
    },
  };
});
