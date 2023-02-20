var __getOwnPropNames = Object.getOwnPropertyNames;
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

// node_modules/.pnpm/registry.npmmirror.com+tsup@6.6.3_typescript@4.9.5/node_modules/tsup/assets/esm_shims.js
import { fileURLToPath } from "url";
import path from "path";
var getFilename = () => fileURLToPath(import.meta.url);
var getDirname = () => path.dirname(getFilename());
var __dirname = /* @__PURE__ */ getDirname();

// src/node/cli.ts
import { cac } from "cac";

// src/node/build.ts
import { build as viteBuild } from "vite";

// src/node/constants/index.ts
import { join } from "path";
var PACKAGE_ROOT = join(__dirname, "..");
var DEFAULT_HTML_PATH = join(PACKAGE_ROOT, "index.html");
var CLIENT_ENTRY_PATH = join(PACKAGE_ROOT, "src", "runtime", "client-entry.tsx");
var SERVER_ENTRY_PATH = join(PACKAGE_ROOT, "src", "runtime", "ssr-entry.tsx");

// src/node/build.ts
import * as path2 from "path";

// src/node/renderPage.ts
import { join as join2 } from "path";
import fs from "fs-extra";
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
      <script type="module" src="/${clientChunk?.fileName}"></script>
  </body>
  </html>
`.trim();
  await fs.ensureDir(join2(root, "build"));
  await fs.writeFile(join2(root, "build/index.html"), res);
  await fs.remove(join2(root, ".temp"));
};

// src/node/build.ts
import pluginReact from "@vitejs/plugin-react";
import ora from "ora";
var bundle = async (root) => {
  try {
    const resolveViteConfig = (isServer) => ({
      mode: "production",
      root,
      plugins: [pluginReact()],
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
    const spinner = ora();
    spinner.start(`Building client + server bundles...`);
    const clientBuild = () => viteBuild(resolveViteConfig(false));
    const serverBuild = () => viteBuild(resolveViteConfig(true));
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
  const serverEntryPath = path2.join(PACKAGE_ROOT, root, ".temp", "ssr-entry.js");
  const { render } = await import(serverEntryPath);
  await renderPage(render, root, clientBundle);
};

// src/node/cli.ts
var version = require_package().version;
var cli = cac("island").version(version).help();
cli.command("build [root]", "build for production").action(async (root) => {
  await build(root);
});
cli.parse();
