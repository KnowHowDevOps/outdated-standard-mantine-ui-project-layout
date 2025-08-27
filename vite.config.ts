import tanstackRouter from "@tanstack/router-plugin/vite";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tsconfigPaths from "vite-tsconfig-paths";
import { resolve } from 'path';

const isTest = process.env.NODE_ENV === "test";

// https://vite.dev/config/
export default defineConfig({
  plugins: [tsconfigPaths(), react(), !isTest && tanstackRouter()],
    resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@/components': resolve(__dirname, './src/components'),
      '@/pages': resolve(__dirname, './src/pages'),
      '@/hooks': resolve(__dirname, './src/hooks'),
      '@/utils': resolve(__dirname, './src/utils'),
      '@/types': resolve(__dirname, './src/types'),
      '@/schemas': resolve(__dirname, './src/schemas'),
      '@/api': resolve(__dirname, './src/api'),
    },
  },
});
