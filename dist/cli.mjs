import {
  CLIENT_ENTRY_PATH,
  PACKAGE_ROOT,
  SERVER_ENTRY_PATH,
  configPlugin,
  pluginRoutes
} from "./chunk-4T4CNRLB.mjs";
import {
  __commonJS,
  resolveConfig
} from "./chunk-ME5MTLVC.mjs";

// package.json
var require_package = __commonJS({
  "package.json"(exports, module) {
    module.exports = {
      name: "island-dev",
      version: "1.0.0",
      description: "",
      main: "index.js",
      scripts: {
        dev: "tsup --watch",
        build: "tsup",
        preview: "cd build && serve .",
        lint: "eslint --ext .ts,.tsx,.js,.jsx ./",
        "lint:fix": "eslint --fix --ext .ts,.tsx,.js,.jsx --quiet ./",
        prepare: "husky install",
        "test:unit": "vitest run",
        "test:e2e": "playwright test",
        "prepare:e2e": "tsx ./scripts/prepare-e2e.cts"
      },
      bin: {
        island: "bin/island.js"
      },
      keywords: [],
      author: "",
      license: "ISC",
      "lint-staged": {
        "**/*.{js,jsx,tsx,ts}": [
          "npm run lint"
        ]
      },
      devDependencies: {
        "@commitlint/cli": "^17.2.0",
        "@commitlint/config-conventional": "^17.2.0",
        "@playwright/test": "1.26.1",
        "@types/fs-extra": "^9.0.13",
        "@types/node": "^18.11.7",
        "@types/react": "^18.0.24",
        "@types/react-dom": "^18.0.8",
        "@typescript-eslint/eslint-plugin": "^5.43.0",
        "@typescript-eslint/parser": "^5.43.0",
        "@vitest/ui": "^0.25.2",
        commitlint: "^17.2.0",
        eslint: "^8.27.0",
        "eslint-config-prettier": "^8.5.0",
        "eslint-plugin-prettier": "^4.2.1",
        "eslint-plugin-react": "^7.31.10",
        "eslint-plugin-react-hooks": "^4.6.0",
        execa: "5.1.1",
        husky: "^8.0.2",
        "lint-staged": "^13.0.3",
        prettier: "^2.7.1",
        rollup: "^3.2.3",
        serve: "^14.0.1",
        tsup: "^6.5.0",
        tsx: "^3.12.1",
        typescript: "^4.8.4",
        vitest: "^0.25.2"
      },
      dependencies: {
        "@loadable/component": "^5.15.2",
        "@vitejs/plugin-react": "^2.2.0",
        cac: "^6.7.14",
        "fast-glob": "^3.2.12",
        "fs-extra": "^10.1.0",
        ora: "^6.1.2",
        react: "^18.2.0",
        "react-dom": "^18.2.0",
        "react-router-dom": "6.4.3",
        vite: "3.1.4"
      }
    };
  }
});

// src/node/cli.ts
import { cac } from "cac";

// src/node/build.ts
import ora from "ora";
import { build as viteBuild } from "vite";
import * as path from "path";

// src/node/renderPage.ts
import { join } from "path";
import fs from "fs-extra";
var renderPage = async (render, root, clientBundle) => {
  const html = render();
  const clientChunk = clientBundle.output.find(
    (chunk) => chunk.type === "chunk" && chunk.isEntry
  );
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
  await fs.ensureDir(join(root, "build"));
  await fs.writeFile(join(root, "build/index.html"), res);
  await fs.remove(join(root, ".temp"));
};

// src/node/build.ts
import pluginReact from "@vitejs/plugin-react";
var bundle = async (root, config) => {
  try {
    const resolveViteConfig = (isServer) => ({
      mode: "production",
      root,
      plugins: [
        pluginReact(),
        configPlugin(config),
        pluginRoutes({
          root: config.root
        })
      ],
      ssr: {
        // 解决依赖兼容性问题,方式cjs产物require 这个包，因为它只提供了esm格式的产物！
        noExternal: ["react-router-dom"]
      },
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
    spinner.start("Building client + server bundles...");
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
var build = async (root = process.cwd(), config) => {
  const [clientBundle] = await bundle(root, config);
  const serverEntryPath = path.join(PACKAGE_ROOT, root, ".temp", "ssr-entry.js");
  const { render } = await import(serverEntryPath);
  await renderPage(render, root, clientBundle);
};

// src/node/cli.ts
var version = require_package().version;
var cli = cac("island").version(version).help();
cli.command("build [root]", "build for production").action(async (root) => {
  const config = await resolveConfig(root, "build", "production");
  await build(root, config);
});
cli.command("[root]", "start dev server").alias("dev").action(async (root) => {
  const createServer = async () => {
    const { createDevServer } = await import("./dev.mjs");
    const server = await createDevServer(root, async () => {
      await server.close();
      await createServer();
    });
    await server.listen();
    server.printUrls();
  };
  await createServer();
});
cli.parse();
