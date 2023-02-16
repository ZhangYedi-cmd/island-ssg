import { createServer as createViteDevServer } from "vite";
import {islandHtmlPlugin} from "./plugin-island/indexHtml";
import pluginReact from "@vitejs/plugin-react";

export async function createDevServer(root = process.cwd()) {
  return createViteDevServer({
    root,
    plugins: [
      islandHtmlPlugin(),
      pluginReact()
    ]
  });
}
