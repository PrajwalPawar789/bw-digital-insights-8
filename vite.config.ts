
import dns from "node:dns";
import https from "node:https";
import net from "node:net";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
const createSupabaseProxy = (supabaseUrl: string) => {
  if (!supabaseUrl) return undefined;

  dns.setServers(["1.1.1.1", "8.8.8.8"]);

  const publicDnsLookup: dns.LookupFunction = (hostname, options, callback) => {
    const wantsAll = typeof options === "object" && options?.all === true;

    dns.resolve4(hostname, (resolveError, addresses) => {
      const validAddresses = (Array.isArray(addresses) ? addresses : []).filter(
        (address): address is string => typeof address === "string" && net.isIP(address) === 4
      );

      if (!resolveError && validAddresses.length > 0) {
        if (wantsAll) {
          (callback as dns.LookupAllCallback)(
            null,
            validAddresses.map((address) => ({ address, family: 4 }))
          );
          return;
        }

        (callback as dns.LookupCallback)(null, validAddresses[0], 4);
        return;
      }

      dns.lookup(hostname, { family: 4, all: wantsAll }, callback as any);
    });
  };

  return {
    target: supabaseUrl,
    changeOrigin: true,
    secure: true,
    rewrite: (requestPath: string) => requestPath.replace(/^\/supabase/, ""),
    agent: new https.Agent({ lookup: publicDnsLookup }),
  };
};

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const supabaseProxy = createSupabaseProxy((env.VITE_SUPABASE_URL || "").replace(/\/$/, ""));

  return {
    server: {
      host: "::",
      port: 8080,
      proxy: supabaseProxy
        ? {
            "/supabase": supabaseProxy,
          }
        : undefined,
    },
    plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      outDir: "build",
      sourcemap: false,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ["react", "react-dom"],
            ui: ["@radix-ui/react-dialog", "@radix-ui/react-select", "@radix-ui/react-switch"],
          },
        },
      },
    },
    define: {
      // Remove hardcoded Supabase credentials - use environment variables instead
    },
  };
});
