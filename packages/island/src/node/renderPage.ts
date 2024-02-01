import {RollupOutput} from "rollup";
import fs from 'fs-extra'
import {join} from "path";

export const renderPage = async (root: string, render: () => string, clientBundle: RollupOutput) => {
    // SSR  ->  HTML DOM
    const html = render()
    // CSR -> chunks
    const clientChunk = clientBundle?.output?.find((chunk) => chunk.type === 'chunk' && chunk.isEntry)

    const res = ` <!doctype html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport"
              content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <title>Document</title>
      </head>
      <body>
         <div id="root">${html}</div>
          <script type="module" src="/${clientChunk?.fileName}"></script>
      </body>
      </html>`

    await fs.ensureDir(join(root, 'build'))
    await fs.writeFile(join(root, 'build/index.html'), res)
    await fs.remove(join(root, '.temp'))
}
