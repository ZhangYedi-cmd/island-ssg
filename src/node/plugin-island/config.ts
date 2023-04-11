import { SiteConfig } from '../../shared/types'
import { Plugin } from 'vite'
import { relative } from 'path'
import { join } from 'path'
import { PACKAGE_ROOT } from '../constants'
// 虚拟模块id
const SITE_DATA_ID = 'island:site-data'

/**
 * 当导入island:site-data时，自动返回配置
 * @param config
 */
export const configPlugin = (
  config: SiteConfig,
  restartDevServer?: () => Promise<void>
): Plugin => {
  return {
    name: 'island:site-data',
    // import * from ${resolveId}
    resolveId(id) {
      if (id === SITE_DATA_ID) {
        return '\0' + SITE_DATA_ID
      }
    },
    // 加载时 返回编译后的配置
    load(id) {
      if (id === '\0' + SITE_DATA_ID) {
        return `export default ${JSON.stringify(config)}`
      }
    },
    config() {
      return {
        resolve: {
          alias: {
            '@runtime': join(PACKAGE_ROOT, 'src', 'runtime', 'index.ts')
          }
        }
      }
    },
    // 配置文件更新后 自动重启服务
    async handleHotUpdate(ctx) {
      const customFiles = [config.configPath, ...config.configDeps]
      const include = (id: string) =>
        customFiles.some((filePath) => filePath.includes(id))
      if (include(ctx.file)) {
        console.log(
          `\n${relative(config.root, ctx.file)} changed, restarting server...`
        )
        await restartDevServer()
      }
    }
  }
}
