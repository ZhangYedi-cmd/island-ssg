/**
 * 📦打包阶段应该做什么？
 *  1. CSR,SSR bundle
 *  2. 将CSR打包产物渲染 RenderToString
 *  3. 返回HTML
 */
import {build as viteBuild, InlineConfig} from "vite";
import {CLIENT_ENTRY_PATH, PACKAGE_ROOT, SERVER_ENTRY_PATH} from "./constants";
import * as path from "path";
import {renderPage} from "./renderPage";

export const bundle = async (root: string) => {
  try {
    const resolveViteConfig = (isServerBuild: boolean): InlineConfig => {
      return {
        mode: 'production',
        root,
        build: {
          outDir: isServerBuild ? '.temp' : 'build',
          rollupOptions: {
            input: isServerBuild ? SERVER_ENTRY_PATH : CLIENT_ENTRY_PATH,
            output: isServerBuild ? {format: 'cjs', entryFileNames: '[name].js'} : {format: 'esm'}
          }
        }
      }
    }
    const clientBuild = () => {
      return viteBuild(resolveViteConfig(false))
    }
    const serverBuild = () => {
      return viteBuild(resolveViteConfig(true))
    }
    console.log("building for server and client 🚀！")
    // 优化build流程，服务端打包流程，客户端打包流程并发执行。
    const [clientBundle, serverBundle] = await Promise.all([
      clientBuild(),
      serverBuild()
    ])
    console.log('build done 🔥')
    return [clientBundle, serverBundle]
  } catch (e) {
    console.log(e)
  }
}
/**
 * build:
 * SSG = SSR + CSR
 * SSR: 对我们的React代码进行分析，将其转换为DOM
 * CSR：将我们写的JS逻辑代码注入到SSR生成的HTML-DOM中
 */
export const build = async (root: string) => {
  const [clientBundle, serverBundle] = await bundle(root)
  // 拿到打包后SSR生成DOM脚本
  const serverEntryPath = path.join(PACKAGE_ROOT, root, ".temp", "ssr-entry.js")
  const {render} = require(serverEntryPath)
  console.log(render)
  // const html = renderPage(render, root, clientBundle)
  // console.log(html)
}

