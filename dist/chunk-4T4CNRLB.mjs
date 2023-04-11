import {
  __dirname
} from "./chunk-ME5MTLVC.mjs";

// src/node/constants/index.ts
import { join } from "path";
var PACKAGE_ROOT = join(__dirname, "..");
var DEFAULT_HTML_PATH = join(PACKAGE_ROOT, "index.html");
var CLIENT_ENTRY_PATH = join(PACKAGE_ROOT, "src", "runtime", "client-entry.tsx");
var SERVER_ENTRY_PATH = join(PACKAGE_ROOT, "src", "runtime", "ssr-entry.tsx");
var DOCS_PATH = join(PACKAGE_ROOT, "docs");

// src/node/plugin-island/config.ts
import { relative } from "path";
import { join as join2 } from "path";
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
    config() {
      return {
        resolve: {
          alias: {
            "@runtime": join2(PACKAGE_ROOT, "src", "runtime", "index.ts")
          }
        }
      };
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

// src/node/plugin-routes/RouteService.ts
import fastGlob from "fast-glob";
import { normalizePath } from "vite";
import path from "path";
var RouteService = class {
  #scanDir;
  #routeData = [];
  constructor(scanDir) {
    this.#scanDir = scanDir;
  }
  async init() {
    const files = fastGlob.sync(["**/*.{js,jsx,ts,tsx,md,mdx}"], {
      cwd: this.#scanDir,
      absolute: true,
      ignore: ["**/node_modules/**", "**/build/**", "config.ts", "**/src/**", "**/dist/**"]
    }).sort();
    files.forEach((file) => {
      const fileRelativePath = normalizePath(
        path.relative(this.#scanDir, file)
      );
      const routePath = this.normalizeRoutePath(fileRelativePath);
      this.#routeData.push({
        routePath,
        absolutePath: file
      });
    });
  }
  getRouteMeta() {
    return this.#routeData;
  }
  normalizeRoutePath(rawPath) {
    const routePath = rawPath.replace(/\.(.*)?$/, "").replace(/index$/, "");
    return routePath.startsWith("/") ? routePath : `/${routePath}`;
  }
  generateRoutesCode() {
    return `
import React from 'react';
import loadable from '@loadable/component';
${this.#routeData.map((route, index) => {
      return `const Route${index} = loadable(() => import('${route.absolutePath}'));`;
    }).join("\n")}
export const routes = [
  ${this.#routeData.map((route, index) => {
      return `{ path: '${route.routePath}', element: React.createElement(Route${index}) }`;
    }).join(",\n")}
];
`;
  }
};

// src/node/plugin-routes/index.ts
var CONVENTIONAL_ROUTE_ID = "island:routes";
function pluginRoutes(options) {
  const routeService = new RouteService(options.root);
  return {
    name: "island:routes",
    async configResolved() {
      await routeService.init();
    },
    resolveId(id) {
      if (id === CONVENTIONAL_ROUTE_ID) {
        return "\0" + id;
      }
    },
    load(id) {
      if (id === "\0" + CONVENTIONAL_ROUTE_ID) {
        return routeService.generateRoutesCode();
      }
    }
  };
}

export {
  PACKAGE_ROOT,
  DEFAULT_HTML_PATH,
  CLIENT_ENTRY_PATH,
  SERVER_ENTRY_PATH,
  configPlugin,
  pluginRoutes
};
