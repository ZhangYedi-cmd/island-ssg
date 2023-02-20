/**
 * 📦打包阶段应该做什么？
 *  1. CSR,SSR bundle
 *  2. 将CSR打包产物渲染 RenderToString
 *  3. 返回HTML
 */
import { build as viteBuild } from 'vite'
import { CLIENT_ENTRY_PATH, PACKAGE_ROOT, SERVER_ENTRY_PATH } from './constants'
import * as path from 'path'
import { renderPage } from './renderPage'
import pluginReact from '@vitejs/plugin-react'
import ora from 'ora'
import { RollupOutput } from 'rollup'

export const bundle = async (root: string) => {
  try {
    const resolveViteConfig = (isServer: boolean) => ({
      mode: 'production',
      root,
      plugins: [pluginReact()],
      build: {
        ssr: isServer,
        outDir: isServer ? '.temp' : 'build',
        rollupOptions: {
          input: isServer ? SERVER_ENTRY_PATH : CLIENT_ENTRY_PATH,
          output: {
            format: isServer ? 'cjs' : 'esm'
          }
        }
      }
    })
    const spinner = ora()
    spinner.start('Building client + server bundles...')

    // @ts-ignore
    const clientBuild = () => viteBuild(resolveViteConfig(false))
    // @ts-ignore
    const serverBuild = () => viteBuild(resolveViteConfig(true))

    // 优化build流程，服务端打包流程，客户端打包流程并发执行。
    const [clientBundle, serverBundle] = await Promise.all([
      clientBuild(),
      serverBuild()
    ])
    spinner.stop()
    return [clientBundle, serverBundle] as [RollupOutput, RollupOutput]
  } catch (e) {
    console.log(e)
  }
}

/**
 * build:
 * SSG = SSR + CSR
 * SSR: 对我们的React代码进行分析，将其转换为DOM
 * CSR：将我们写的JS逻辑代码注入到SSR生成的HTML-DOM中
 * 同构架构：一套代码 放到两个环境中执行
 */
export const build = async (root: string = process.cwd()) => {
  const [clientBundle] = await bundle(root)

  // 拿到打包后SSR生成DOM脚本
  const serverEntryPath = path.join(PACKAGE_ROOT, root, '.temp', 'ssr-entry.js')
  const { render } = await import(serverEntryPath)
  await renderPage(render, root, clientBundle)
}
