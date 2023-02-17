/**
 * 📦打包阶段应该做什么？
 *  1. CSR,SSR bundle
 *  2. 将CSR打包产物渲染 RenderToString
 *  3. 返回HTML
 */
import {build as viteBuild, InlineConfig} from "vite";
import {CLIENT_ENTRY_PATH, SERVER_ENTRY_PATH} from "./constants";
import * as path from "path";

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
            output: {
              assetFileNames: '[name]',
              format: isServerBuild ? 'cjs' : 'esm'
            }
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

export const build = async (root: string) => {
  const [clientBundle, serverBundle] = await bundle(root)
  const serverEntryPath = path.join(root, ".temp", "ssr-entry.js")
}

