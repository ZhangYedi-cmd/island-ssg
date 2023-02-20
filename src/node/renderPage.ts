import { join } from 'path'
import fs from 'fs-extra'

/**
 * 渲染最终的HTML
 */
export const renderPage = async (
  render: () => string,
  root: string,
  clientBundle: any
) => {
  const html = render()
  const clientChunk = clientBundle.output.find(
    (chunk) => chunk.type === 'chunk' && chunk.isEntry
  )
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
      <!--  SSR 产出的HTML-->
     <div id="root">${html}</div>
     <!--  CSR 生成的JS脚本-->
      <script type="module" src="/${clientChunk?.fileName}"></script>
  </body>
  </html>
`.trim()
  await fs.ensureDir(join(root, 'build'))
  await fs.writeFile(join(root, 'build/index.html'), res)
  await fs.remove(join(root, '.temp'))
}
