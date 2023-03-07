"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }




var _chunkGOHTTJGVjs = require('./chunk-GOHTTJGV.js');


var _chunkCJ6ITQK3js = require('./chunk-CJ6ITQK3.js');

// src/node/dev.ts
var _vite = require('vite');

// src/node/plugin-island/indexHtml.ts
var _promises = require('fs/promises');
function islandHtmlPlugin() {
  return {
    name: "island:index-html",
    apply: "serve",
    // 自动注入script
    transformIndexHtml(html) {
      return {
        html,
        tags: [
          {
            tag: "script",
            attrs: {
              type: "module",
              src: `/@fs/${_chunkGOHTTJGVjs.CLIENT_ENTRY_PATH}`
            },
            injectTo: "body"
          }
        ]
      };
    },
    // get http request
    configureServer(server) {
      return () => {
        server.middlewares.use(async (req, res, next) => {
          let html = await _promises.readFile.call(void 0, _chunkGOHTTJGVjs.DEFAULT_HTML_PATH, "utf-8");
          try {
            html = await server.transformIndexHtml(
              req.url,
              html,
              req.originalUrl
            );
            res.statusCode = 200;
            res.setHeader("Content-Type", "text/html");
            res.end(html);
          } catch (e) {
            return next(e);
          }
        });
      };
    }
  };
}

// src/node/dev.ts
var _pluginreact = require('@vitejs/plugin-react'); var _pluginreact2 = _interopRequireDefault(_pluginreact);
async function createDevServer(root = process.cwd(), restartDevServer) {
  const config = await _chunkCJ6ITQK3js.resolveConfig.call(void 0, root, "serve", "development");
  return _vite.createServer.call(void 0, {
    // vite 本身就是一个静态资源代理  在访问深路由之前就已经返回文件内容 我们让devServer 代理docs目录就可以解决这个问题
    root: _chunkGOHTTJGVjs.PACKAGE_ROOT,
    plugins: [
      islandHtmlPlugin(),
      _pluginreact2.default.call(void 0, ),
      _chunkGOHTTJGVjs.configPlugin.call(void 0, config, restartDevServer)
    ]
  });
}


exports.createDevServer = createDevServer;
