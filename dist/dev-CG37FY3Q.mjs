import {
  CLIENT_ENTRY_PATH,
  DEFAULT_HTML_PATH
} from "./chunk-OV5XYNMI.mjs";

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

// src/node/config.ts
import { resolve } from "path";
import { loadConfigFromFile } from "vite";
import fs from "fs-extra";
var getUserConfigPath = (root) => {
  try {
    const supportConfigFiles = ["islandConfig.ts", "islandConfig.js"];
    const configPath = supportConfigFiles.map((file) => resolve(root, file)).find(fs.pathExistsSync);
    return configPath;
  } catch (e) {
    console.error(`Failed to load user config: ${e}`);
    throw e;
  }
};
var resolveUserConfig = async (root, command, mode) => {
  const configPath = getUserConfigPath(root);
  const result = await loadConfigFromFile(
    {
      command,
      mode
    },
    configPath,
    root
  );
  if (result) {
    const {
      config: rawConfig = {},
      dependencies: deps = []
    } = result;
    const userConfig = await (typeof rawConfig === "function" ? rawConfig() : rawConfig);
    return [configPath, userConfig, deps];
  } else {
    return [configPath, {}, []];
  }
};
var resolveSiteConfig = (userConfig) => {
  return {
    title: userConfig?.title || "island docs",
    description: userConfig.description || "SSG Framework",
    themeConfig: userConfig.themeConfig || {},
    vite: userConfig.vite || {}
  };
};
var resolveConfig = async (root, command, mode) => {
  const [configPath, userConfig, configDeps] = await resolveUserConfig(
    root,
    command,
    mode
  );
  const siteConfig = {
    root,
    configPath,
    configDeps,
    siteData: resolveSiteConfig(userConfig)
  };
  return siteConfig;
};

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
