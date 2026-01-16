import { defineConfig } from "vite";
import { fresh } from "@fresh/plugin-vite";

export default defineConfig({
  plugins: [fresh()],
  ssr: {
    // Externalize commonjs dependencies that rely on 'module' or 'exports'
    external: [
      "googleapis",
      "google-auth-library",
      "gcp-metadata",
      "json-bigint",
      "htmlparser2",
      "googledoc-to-json",
    ],
  },
});
