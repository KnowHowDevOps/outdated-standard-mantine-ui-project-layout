import tanstackRouter from "@tanstack/router-plugin/vite";
import { defineConfig } from "vite";
import { lingui } from "@lingui/vite-plugin";
import react from "@vitejs/plugin-react-swc";
import tsconfigPaths from "vite-tsconfig-paths";
import { fileURLToPath } from "node:url";

const isTest =
  typeof process !== "undefined" && process.env.NODE_ENV === "test";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tsconfigPaths(),
    react({
      plugins: [["@lingui/swc-plugin", {}]],
    }),
    lingui(),
    !isTest && tanstackRouter(),
  ],
  resolve: {
    alias: [
      {
        find: "msw/node",
        replacement: fileURLToPath(
          new URL("./src/shared/lib/msw/shims/node.ts", import.meta.url)
        ),
      },
    ],
  },
  optimizeDeps: {
    exclude: ["msw"],
  },
});
