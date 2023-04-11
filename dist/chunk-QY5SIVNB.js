"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }// src/node/constants/index.ts
var _path = require('path'); var _path2 = _interopRequireDefault(_path);
var PACKAGE_ROOT = _path.join.call(void 0, __dirname, "..");
var DEFAULT_HTML_PATH = _path.join.call(void 0, PACKAGE_ROOT, "index.html");
var CLIENT_ENTRY_PATH = _path.join.call(void 0, PACKAGE_ROOT, "src", "runtime", "client-entry.tsx");
var SERVER_ENTRY_PATH = _path.join.call(void 0, PACKAGE_ROOT, "src", "runtime", "ssr-entry.tsx");
var DOCS_PATH = _path.join.call(void 0, PACKAGE_ROOT, "docs");

// src/node/plugin-island/config.ts


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
            "@runtime": _path.join.call(void 0, PACKAGE_ROOT, "src", "runtime", "index.ts")
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
${_path.relative.call(void 0, config.root, ctx.file)} changed, restarting server...`
        );
        await restartDevServer();
      }
    }
  };
};

// src/node/plugin-routes/RouteService.ts
var _fastglob = require('fast-glob'); var _fastglob2 = _interopRequireDefault(_fastglob);
var _vite = require('vite');

var RouteService = class {
  #scanDir;
  #routeData = [];
  constructor(scanDir) {
    this.#scanDir = scanDir;
  }
  async init() {
    const files = _fastglob2.default.sync(["**/*.{js,jsx,ts,tsx,md,mdx}"], {
      cwd: this.#scanDir,
      absolute: true,
      ignore: ["**/node_modules/**", "**/build/**", "config.ts", "**/src/**", "**/dist/**"]
    }).sort();
    files.forEach((file) => {
      const fileRelativePath = _vite.normalizePath.call(void 0, 
        _path2.default.relative(this.#scanDir, file)
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








exports.PACKAGE_ROOT = PACKAGE_ROOT; exports.DEFAULT_HTML_PATH = DEFAULT_HTML_PATH; exports.CLIENT_ENTRY_PATH = CLIENT_ENTRY_PATH; exports.SERVER_ENTRY_PATH = SERVER_ENTRY_PATH; exports.configPlugin = configPlugin; exports.pluginRoutes = pluginRoutes;
