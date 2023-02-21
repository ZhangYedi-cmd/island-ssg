"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }// src/node/config.ts
var _path = require('path');
var _vite = require('vite');
var _fsextra = require('fs-extra'); var _fsextra2 = _interopRequireDefault(_fsextra);
var getUserConfigPath = (root) => {
  try {
    const supportConfigFiles = ["islandConfig.ts", "islandConfig.js"];
    const configPath = supportConfigFiles.map((file) => _path.resolve.call(void 0, root, file)).find(_fsextra2.default.pathExistsSync);
    return configPath;
  } catch (e) {
    console.error(`Failed to load user config: ${e}`);
    throw e;
  }
};
var resolveUserConfig = async (root, command, mode) => {
  const configPath = getUserConfigPath(root);
  const result = await _vite.loadConfigFromFile.call(void 0, 
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
    title: _optionalChain([userConfig, 'optionalAccess', _ => _.title]) || "island docs",
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
var defineConfig = (config) => {
  return config;
};




exports.resolveConfig = resolveConfig; exports.defineConfig = defineConfig;
