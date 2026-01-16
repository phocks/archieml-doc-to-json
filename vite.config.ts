import { defineConfig } from "vite";
import { fresh } from "@fresh/plugin-vite";

export default defineConfig({
  plugins: [fresh()],
  ssr: {
    // Externalize commonjs dependencies that rely on 'module' or 'exports'
    external: [
      "json-bigint",
      "googledoc-to-json",
      "googleapis",
      "archieml",
      "htmlparser2",
      "html-entities",
      "url",
    ],
  },
  build: {
    sourcemap: false,
  },
});
