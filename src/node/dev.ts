import { createServer as createViteDevServer } from 'vite'
import { islandHtmlPlugin } from './plugin-island/indexHtml'
import pluginReact from '@vitejs/plugin-react'
import { resolveConfig } from './config'
import { configPlugin } from './plugin-island/config'

export async function createDevServer(root = process.cwd(), restartDevServer) {
  const config = await resolveConfig(root, 'serve', 'development')
  return createViteDevServer({
    root,
    plugins: [
      islandHtmlPlugin(),
      pluginReact(),
      configPlugin(config, restartDevServer)
    ]
  })
}
