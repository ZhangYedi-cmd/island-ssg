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
var defineConfig = (config) => {
  return config;
};

export {
  resolveConfig,
  defineConfig
};
