import { resolve } from 'path'
import { loadConfigFromFile } from 'vite'
import { SiteConfig, UserConfig } from '../shared/types'
//@ts-ignore
import fs from 'fs-extra'

type RawConfig =
  | UserConfig
  | Promise<UserConfig>
  | (() => UserConfig | Promise<UserConfig>)

const getUserConfigPath = (root: string) => {
  try {
    const supportConfigFiles = ['islandConfig.ts', 'islandConfig.js']
    const configPath = supportConfigFiles
      .map((file) => resolve(root, file))
      .find(fs.pathExistsSync)
    return configPath
  } catch (e) {
    console.error(`Failed to load user config: ${e}`)
    throw e
  }
}

/**
 * 获取用户配置
 * @param root
 * @param command
 * @param mode
 */
const resolveUserConfig = async (
  root: string,
  command: 'serve' | 'build',
  mode: 'development' | 'production'
) => {
  // 获取配置文件路径
  const configPath = getUserConfigPath(root)
  // 解析配置文件 导入vite已有的API
  const result = await loadConfigFromFile({ command, mode }, configPath, root)
  if (result) {
    const {
      config: rawConfig = {} as RawConfig,
      dependencies: deps = [] as string[]
    } = result
    // 三种情况:
    // 1. object
    // 2. promise
    // 3. function
    const userConfig = await (typeof rawConfig === 'function'
      ? rawConfig()
      : rawConfig)
    return [configPath, userConfig, deps] as const
  } else {
    return [configPath, {} as UserConfig, [] as string[]] as const
  }
}

/**
 * 获取站点配置
 * @param userConfig
 */
const resolveSiteConfig = (userConfig: UserConfig): UserConfig => {
  return {
    title: userConfig?.title || 'island docs',
    description: userConfig.description || 'SSG Framework',
    themeConfig: userConfig.themeConfig || {},
    vite: userConfig.vite || {}
  }
}

/**
 * 获取所有配置：用户配置 ｜ 站点默认配置
 * @param root
 * @param command
 * @param mode
 */
export const resolveConfig = async (
  root: string,
  command: 'serve' | 'build',
  mode: 'development' | 'production'
) => {
  const [configPath, userConfig, configDeps] = await resolveUserConfig(
    root,
    command,
    mode
  )
  const siteConfig: SiteConfig = {
    root,
    configPath,
    configDeps,
    siteData: resolveSiteConfig(userConfig as UserConfig)
  }
  return siteConfig
}

export const defineConfig = (config: UserConfig) => {
  return config
}
