import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/",
  plugins: [react()],
  build: {
    // Raise chunk warning threshold slightly (bundle is intentionally small)
    chunkSizeWarningLimit: 200,
  },
  server: {
    headers: {
      // Long cache for hashed assets during local preview
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  },
  preview: {
    headers: {
      // Hashed JS/CSS assets — immutable (1 year)
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  },
});
