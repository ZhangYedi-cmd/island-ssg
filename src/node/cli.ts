import { cac } from 'cac'
import { createDevServer } from './dev.js'
import { build } from './build'
import { resolveConfig } from './config'

const version = require('../../package.json').version
const cli = cac('island').version(version).help()

cli
  .command('build [root]', 'build for production')
  .action(async (root: string) => {
    const config = await resolveConfig(root, 'build', 'production')
    await build(root, config)
  })

cli
  .command('[root]', 'start dev server')
  .alias('dev')
  .action(async (root: string) => {
    const createServer = async () => {
      const { createDevServer } = await import('./dev')
      const server = await createDevServer(root, async () => {
        await server.close()
        await createServer()
      })
      await server.listen()
      server.printUrls()
    }
    await createServer()
  })

cli.parse()
