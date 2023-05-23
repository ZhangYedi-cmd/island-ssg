import { createServer } from 'vite'
import { resolveConfig } from './config'
import { PACKAGE_ROOT } from './constants'
import { resolveIslandPlugins } from './islandPlugins'

export async function createDevServer(root = process.cwd(), restartDevServer) {
  const config = await resolveConfig(root, 'serve', 'development')
  return createServer({
    // vite 本身就是一个静态资源代理  在访问深路由之前就已经返回文件内容 我们让devServer 代理docs目录就可以解决这个问题
    root: PACKAGE_ROOT,
    // @ts-ignore
    plugins: await resolveIslandPlugins(config, restartDevServer)
  })
}
