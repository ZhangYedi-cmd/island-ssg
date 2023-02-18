/**
 * 渲染最终的HTML
 */

export const renderPage = (
  render: () => string,
  root: string,
  clientBundle: any
) => {
  const html = render()
  return `
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
  </body>
  </html>
`
}
