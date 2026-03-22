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
          "vendor-ui": ["@radix-ui/react-dialog", "@radix-ui/react-select", "@radix-ui/react-switch", "@radix-ui/react-slot"],
          "vendor-table": ["@tanstack/react-table"],
          "vendor-form": ["react-hook-form", "@hookform/resolvers", "zod"],
          "vendor-misc": ["lucide-react", "clsx", "tailwind-merge"],
        },
      },
    },
  },
});
