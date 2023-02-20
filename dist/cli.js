"use strict"; function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { newObj[key] = obj[key]; } } } newObj.default = obj; return newObj; } } function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};

// package.json
var require_package = __commonJS({
  "package.json"(exports, module) {
    module.exports = {
      name: "island-ssg",
      version: "1.0.0",
      description: "",
      main: "index.js",
      bin: {
        island: "bin/island.mjs"
      },
      scripts: {
        "start tsup": "tsup --watch",
        "build tsup": "tsup",
        "start tsc": "tsc -w",
        "build tsc": "tsc"
      },
      keywords: [],
      author: "",
      license: "ISC",
      devDependencies: {
        "@types/fs-extra": "^9.0.13",
        "@types/node": "^18.11.7",
        "@types/react": "^18.0.24",
        "@types/react-dom": "^18.0.8",
        rollup: "^3.2.3",
        serve: "^14.0.1",
        tsup: "^6.5.0",
        typescript: "^4.8.4"
      },
      dependencies: {
        "@vitejs/plugin-react": "^2.2.0",
        cac: "^6.7.14",
        "fs-extra": "^10.1.0",
        ora: "^6.1.2",
        react: "^18.2.0",
        "react-dom": "^18.2.0",
        vite: "^3.2.1"
      }
    };
  }
});

// src/node/cli.ts
var _cac = require('cac');

// src/node/build.ts
var _vite = require('vite');

// src/node/constants/index.ts
var _path = require('path'); var path = _interopRequireWildcard(_path);
var PACKAGE_ROOT = _path.join.call(void 0, __dirname, "..");
var DEFAULT_HTML_PATH = _path.join.call(void 0, PACKAGE_ROOT, "index.html");
var CLIENT_ENTRY_PATH = _path.join.call(void 0, PACKAGE_ROOT, "src", "runtime", "client-entry.tsx");
var SERVER_ENTRY_PATH = _path.join.call(void 0, PACKAGE_ROOT, "src", "runtime", "ssr-entry.tsx");

// src/node/build.ts


// src/node/renderPage.ts

var _fsextra = require('fs-extra'); var _fsextra2 = _interopRequireDefault(_fsextra);
var renderPage = async (render, root, clientBundle) => {
  const html = render();
  const clientChunk = clientBundle.output.find((chunk) => chunk.type === "chunk" && chunk.isEntry);
  const res = `
  <!doctype html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
  </head>
  <body>
      <!--  SSR \u4EA7\u51FA\u7684HTML-->
     <div id="root">${html}</div>
     <!--  CSR \u751F\u6210\u7684JS\u811A\u672C-->
      <script type="module" src="/${_optionalChain([clientChunk, 'optionalAccess', _ => _.fileName])}"></script>
  </body>
  </html>
`.trim();
  await _fsextra2.default.ensureDir(_path.join.call(void 0, root, "build"));
  await _fsextra2.default.writeFile(_path.join.call(void 0, root, "build/index.html"), res);
  await _fsextra2.default.remove(_path.join.call(void 0, root, ".temp"));
};

// src/node/build.ts
var _pluginreact = require('@vitejs/plugin-react'); var _pluginreact2 = _interopRequireDefault(_pluginreact);
var _ora = require('ora'); var _ora2 = _interopRequireDefault(_ora);
var bundle = async (root) => {
  try {
    const resolveViteConfig = (isServer) => ({
      mode: "production",
      root,
      plugins: [_pluginreact2.default.call(void 0, )],
      build: {
        ssr: isServer,
        outDir: isServer ? ".temp" : "build",
        rollupOptions: {
          input: isServer ? SERVER_ENTRY_PATH : CLIENT_ENTRY_PATH,
          output: {
            format: isServer ? "cjs" : "esm"
          }
        }
      }
    });
    const spinner = _ora2.default.call(void 0, );
    spinner.start(`Building client + server bundles...`);
    const clientBuild = () => _vite.build.call(void 0, resolveViteConfig(false));
    const serverBuild = () => _vite.build.call(void 0, resolveViteConfig(true));
    const [clientBundle, serverBundle] = await Promise.all([
      clientBuild(),
      serverBuild()
    ]);
    spinner.stop();
    return [clientBundle, serverBundle];
  } catch (e) {
    console.log(e);
  }
};
var build = async (root = process.cwd()) => {
  const [clientBundle] = await bundle(root);
  const serverEntryPath = path.join(PACKAGE_ROOT, root, ".temp", "ssr-entry.js");
  const { render } = await Promise.resolve().then(() => require(serverEntryPath));
  await renderPage(render, root, clientBundle);
};

// src/node/cli.ts
var version = require_package().version;
var cli = _cac.cac.call(void 0, "island").version(version).help();
cli.command("build [root]", "build for production").action(async (root) => {
  await build(root);
});
cli.parse();
