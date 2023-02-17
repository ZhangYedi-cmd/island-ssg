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
                        output: {
                            assetFileNames: '[name]',
                            format: isServerBuild ? 'cjs' : 'esm'
                        }
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
const build = async (root) => {
    const [clientBundle, serverBundle] = await (0, exports.bundle)(root);
    const serverEntryPath = path.join(root, ".temp", "ssr-entry.js");
};
exports.build = build;
