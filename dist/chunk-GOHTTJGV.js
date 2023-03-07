"use strict";Object.defineProperty(exports, "__esModule", {value: true});// src/node/constants/index.ts
var _path = require('path');
var PACKAGE_ROOT = _path.join.call(void 0, __dirname, "..");
var DEFAULT_HTML_PATH = _path.join.call(void 0, PACKAGE_ROOT, "index.html");
var CLIENT_ENTRY_PATH = _path.join.call(void 0, PACKAGE_ROOT, "src", "runtime", "client-entry.tsx");
var SERVER_ENTRY_PATH = _path.join.call(void 0, PACKAGE_ROOT, "src", "runtime", "ssr-entry.tsx");

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







exports.PACKAGE_ROOT = PACKAGE_ROOT; exports.DEFAULT_HTML_PATH = DEFAULT_HTML_PATH; exports.CLIENT_ENTRY_PATH = CLIENT_ENTRY_PATH; exports.SERVER_ENTRY_PATH = SERVER_ENTRY_PATH; exports.configPlugin = configPlugin;
