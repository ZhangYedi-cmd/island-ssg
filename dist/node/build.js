"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.build = exports.bundle = void 0;
/**
 * 📦打包阶段应该做什么？
 *  1. CSR,SSR bundle
 *  2. 将CSR打包产物渲染 RenderToString
 *  3. 返回HTML
 */
const vite_1 = require("vite");
const constants_1 = require("./constants");
const path = require("path");
const bundle = async (root) => {
    try {
        const resolveViteConfig = (isServerBuild) => {
            return {
                mode: 'production',
                root,
                build: {
                    outDir: isServerBuild ? '.temp' : 'build',
                    rollupOptions: {
                        input: isServerBuild ? constants_1.SERVER_ENTRY_PATH : constants_1.CLIENT_ENTRY_PATH,
                        output: isServerBuild ? { format: 'cjs', entryFileNames: '[name].js' } : { format: 'esm' }
                    }
                }
            };
        };
        const clientBuild = () => {
            return (0, vite_1.build)(resolveViteConfig(false));
        };
        const serverBuild = () => {
            return (0, vite_1.build)(resolveViteConfig(true));
        };
        console.log("building for server and client 🚀！");
        // 优化build流程，服务端打包流程，客户端打包流程并发执行。
        const [clientBundle, serverBundle] = await Promise.all([
            clientBuild(),
            serverBuild()
        ]);
        console.log('build done 🔥');
        return [clientBundle, serverBundle];
    }
    catch (e) {
        console.log(e);
    }
};
exports.bundle = bundle;
/**
 * build:
 * SSG = SSR + CSR
 * SSR: 对我们的React代码进行分析，将其转换为DOM
 * CSR：将我们写的JS逻辑代码注入到SSR生成的HTML-DOM中
 */
const build = async (root) => {
    const [clientBundle, serverBundle] = await (0, exports.bundle)(root);
    // 拿到打包后SSR生成DOM脚本
    const serverEntryPath = path.join(constants_1.PACKAGE_ROOT, root, ".temp", "ssr-entry.js");
    const { render } = require(serverEntryPath);
    console.log(render);
    // const html = renderPage(render, root, clientBundle)
    // console.log(html)
};
exports.build = build;
