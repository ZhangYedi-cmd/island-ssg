import { visit } from 'unist-util-visit'
import type { Plugin } from 'unified'
import { fromHtml } from 'hast-util-from-html'
import shiki from 'shiki'

interface Options {
  highlighter: shiki.Highlighter
}

export const rehypePluginShiki: Plugin<[Options]> = ({ highlighter }) => {
  return (tree) => {
    visit(tree, 'element', (node, index, parent) => {
      // 拿到pre包裹的代码，传给shiki
      // <pre><code>...</code></pre>
      if (
        node.tagName === 'pre' &&
        node.children[0]?.type === 'element' &&
        node.children[0].tagName === 'code'
      ) {
        const codeNode = node.children[0]
        const codeContent = (codeNode.children[0] as Text).value
        const codeClassName = codeNode.properties?.className?.toString() || ''
        const lang = codeClassName.split('-')[1]

        if (!lang) {
          return
        }
        const highlightedCode = highlighter.codeToHtml(codeContent, { lang })
        const fragmentAst = fromHtml(highlightedCode, { fragment: true })
        parent.children.splice(index, 1, ...fragmentAst.children)
      }
    })
  }
}
