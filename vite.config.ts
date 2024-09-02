import { vitePlugin as remix } from "@remix-run/dev";
import { installGlobals } from "@remix-run/node";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { openGraphImagePlugin } from "remix-og-image/plugin";

installGlobals();

export default defineConfig({
  plugins: [
    remix({ appDirectory: "./src/app" }),
    tsconfigPaths(),
    openGraphImagePlugin({
      elementSelector: "#og-image",
      outputDirectory: "./og",
    }),
  ],
});
