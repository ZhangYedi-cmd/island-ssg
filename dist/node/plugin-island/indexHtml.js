"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.islandHtmlPlugin = void 0;
const promises_1 = require("fs/promises");
const constants_1 = require("../constants");
// 使 vite dev server 响应 HTML
function islandHtmlPlugin() {
    return {
        name: "island:index-html",
        apply: "serve",
        // get http request
        configureServer(server) {
            return () => {
                server.middlewares.use(async (req, res, next) => {
                    let html = await (0, promises_1.readFile)(constants_1.DEFAULT_HTML_PATH, "utf-8");
                    try {
                        // Hot Module Replace
                        html = await server.transformIndexHtml(req.url, html, req.originalUrl);
                        res.statusCode = 200;
                        res.setHeader("Content-Type", "text/html");
                        res.end(html);
                    }
                    catch (e) {
                        return next(e);
                    }
                });
            };
        },
    };
}
exports.islandHtmlPlugin = islandHtmlPlugin;
