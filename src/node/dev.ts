import {createServer as createViteDevServer} from 'vite'
import {islandHtmlPlugin} from './plugin-island/indexHtml'
import pluginReact from '@vitejs/plugin-react'
import {resolveConfig} from './config'
import {configPlugin} from './plugin-island/config'
import {PACKAGE_ROOT} from "./constants";

export async function createDevServer(root = process.cwd(), restartDevServer) {
  const config = await resolveConfig(root, 'serve', 'development')
  return createViteDevServer({
    // vite 本身就是一个静态资源代理  在访问深路由之前就已经返回文件内容 我们让devServer 代理docs目录就可以解决这个问题
    root: PACKAGE_ROOT,
    plugins: [
      islandHtmlPlugin(),
      pluginReact(),
      configPlugin(config, restartDevServer)
    ]
  })
}
