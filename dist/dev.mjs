import {
  CLIENT_ENTRY_PATH,
  DEFAULT_HTML_PATH,
  PACKAGE_ROOT,
  configPlugin,
  pluginRoutes
} from "./chunk-4T4CNRLB.mjs";
import {
  resolveConfig
} from "./chunk-ME5MTLVC.mjs";

// src/node/dev.ts
import { createServer as createViteDevServer } from "vite";

// src/node/plugin-island/indexHtml.ts
import { readFile } from "fs/promises";
function islandHtmlPlugin() {
  return {
    name: "island:index-html",
    apply: "serve",
    // 自动注入script
    transformIndexHtml(html) {
      return {
        html,
        tags: [
          {
            tag: "script",
            attrs: {
              type: "module",
              src: `/@fs/${CLIENT_ENTRY_PATH}`
            },
            injectTo: "body"
          }
        ]
      };
    },
    // get http request
    configureServer(server) {
      return () => {
        server.middlewares.use(async (req, res, next) => {
          let html = await readFile(DEFAULT_HTML_PATH, "utf-8");
          try {
            html = await server.transformIndexHtml(
              req.url,
              html,
              req.originalUrl
            );
            res.statusCode = 200;
            res.setHeader("Content-Type", "text/html");
            res.end(html);
          } catch (e) {
            return next(e);
          }
        });
      };
    }
  };
}

// src/node/dev.ts
import pluginReact from "@vitejs/plugin-react";
async function createDevServer(root = process.cwd(), restartDevServer) {
  const config = await resolveConfig(root, "serve", "development");
  return createViteDevServer({
    // vite 本身就是一个静态资源代理  在访问深路由之前就已经返回文件内容 我们让devServer 代理docs目录就可以解决这个问题
    root: PACKAGE_ROOT,
    plugins: [
      islandHtmlPlugin(),
      pluginReact(),
      configPlugin(config, restartDevServer),
      pluginRoutes({
        root: config.root
      })
    ]
  });
}
export {
  createDevServer
};
