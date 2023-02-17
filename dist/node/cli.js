"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cac_1 = require("cac");
const dev_js_1 = require("./dev.js");
const build_1 = require("./build");
const version = require("../../package.json").version;
const cli = (0, cac_1.cac)("island").version(version).help();
const path = require('path');
cli
    .command("build [root]", "build for production")
    .action(async (root) => {
    await (0, build_1.build)(root);
});
cli
    .command("[root]", "start dev server")
    .alias("dev")
    .action(async (root) => {
    console.log(root);
    // 启动 vite Dev Server 服务
    root = root ? path.resolve(root) : process.cwd();
    const server = await (0, dev_js_1.createDevServer)(root);
    await server.listen();
    server.printUrls();
});
cli.parse();
