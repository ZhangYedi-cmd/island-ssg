// 返回island.js集成的所有插件
import { Plugin } from 'vite'
import { SiteConfig } from '../shared/types'
import { islandHtmlPlugin } from './plugin-island/indexHtml'
import { configPlugin } from './plugin-island/config'
import { pluginRoutes } from './plugin-routes'
import { createPluginMdx } from './plugin-mdx'
import pluginReact from '@vitejs/plugin-react'
import pluginUnocss from 'unocss/vite';
import {unocssOptions} from './unocssOptions';


export const resolveIslandPlugins: Plugin[] = async (
  config: SiteConfig,
  restartDevServer?: () => Promise<void>
) => {
  return [
    pluginUnocss(unocssOptions),
    islandHtmlPlugin(),
    pluginReact(),
    configPlugin(config, restartDevServer),
    pluginRoutes({
      root: config.root
    }),
    await createPluginMdx()
  ]
}
