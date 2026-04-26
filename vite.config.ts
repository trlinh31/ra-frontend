import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "vendor-react": ["react", "react-dom", "react-router-dom"],
          "vendor-query": ["@tanstack/react-query", "@tanstack/react-table"],
          "vendor-form": ["react-hook-form", "@hookform/resolvers", "zod"],
          "vendor-ui": ["radix-ui", "class-variance-authority", "clsx", "tailwind-merge"],
          "vendor-editor": [
            "@tiptap/react",
            "@tiptap/starter-kit",
            "@tiptap/extension-link",
            "@tiptap/extension-placeholder",
            "@tiptap/extension-text-align",
            "@tiptap/extension-underline",
          ],
          "vendor-date": ["date-fns", "react-day-picker"],
          "vendor-misc": ["lucide-react", "axios", "react-hot-toast", "react-number-format"],
        },
      },
    },
  },
});
