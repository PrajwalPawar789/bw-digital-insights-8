
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: 'build',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-select', '@radix-ui/react-switch'],
        },
      },
    },
  },
  define: {
    'process.env.VITE_SUPABASE_URL': JSON.stringify('https://xafgvakclkwjivgfzljq.supabase.co'),
    'process.env.VITE_SUPABASE_ANON_KEY': JSON.stringify('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhhZmd2YWtjbGt3aml2Z2Z6bGpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzOTIyNzYsImV4cCI6MjA2Mzk2ODI3Nn0.XS1BZvSgW63kc2t5G5lOVHiWJEzw1VYxa68XihpeCwg'),
  },
}));
