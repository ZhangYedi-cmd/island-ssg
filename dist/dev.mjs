import {
  CLIENT_ENTRY_PATH,
  DEFAULT_HTML_PATH
} from "./chunk-5T7M4LUT.mjs";
import {
  resolveConfig
} from "./chunk-R5WH3C3Q.mjs";
import "./chunk-75VXZAIQ.mjs";

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

// src/node/plugin-island/config.ts
import { relative } from "path";
var SITE_DATA_ID = "island:site-data";
var configPlugin = (config, restartDevServer) => {
  return {
    name: "island:site-data",
    // import * from ${resolveId}
    resolveId(id) {
      if (id === SITE_DATA_ID) {
        return "\0" + SITE_DATA_ID;
      }
    },
    // 加载时 返回编译后的配置
    load(id) {
      if (id === "\0" + SITE_DATA_ID) {
        return `export default ${JSON.stringify(config)}`;
      }
    },
    // 配置文件更新后 自动重启服务
    async handleHotUpdate(ctx) {
      const customFiles = [config.configPath, ...config.configDeps];
      const include = (id) => customFiles.some((filePath) => filePath.includes(id));
      if (include(ctx.file)) {
        console.log(
          `
${relative(config.root, ctx.file)} changed, restarting server...`
        );
        await restartDevServer();
      }
    }
  };
};

// src/node/dev.ts
async function createDevServer(root = process.cwd(), restartDevServer) {
  const config = await resolveConfig(root, "serve", "development");
  return createViteDevServer({
    root,
    plugins: [
      islandHtmlPlugin(),
      pluginReact(),
      configPlugin(config, restartDevServer)
    ]
  });
}
export {
  createDevServer
};
