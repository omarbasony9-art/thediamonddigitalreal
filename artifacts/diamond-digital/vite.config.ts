import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "dist/public",
    emptyOutDir: true,
  },
  base: "/",
  server: {
    host: "0.0.0.0",
    port: Number(process.env.PORT) || 24068,
    allowedHosts: true,
  },
});
