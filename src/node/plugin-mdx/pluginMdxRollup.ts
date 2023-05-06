// src/node/plugin-mdx/pluginMdxRollup.ts
import pluginMdx from '@mdx-js/rollup'
import type { Plugin } from 'vite'
import remarkPluginGFM from 'remark-gfm'
import rehypePluginAutolinkHeadings from 'rehype-autolink-headings'
import rehypePluginSlug from 'rehype-slug'
import remarkPluginMDXFrontMatter from 'remark-mdx-frontmatter'
import remarkPluginFrontmatter from 'remark-frontmatter'
import { rehypePluginShiki } from './shiki'
import shiki from 'shiki'
import {remarkPluginToc} from "./remarkPlugins/toc";

export async function pluginMdxRollup(): Plugin {
  return pluginMdx({
    // mkd ast阶段 拓展
    remarkPlugins: [
      remarkPluginGFM,
      remarkPluginFrontmatter,
      [remarkPluginMDXFrontMatter, { name: 'frontmatter' }],
      remarkPluginToc,
    ],
    // html 阶段拓展
    rehypePlugins: [
      rehypePluginSlug,
      [
        rehypePluginShiki,
        { highlighter: await shiki.getHighlighter({ theme: 'nord' }) }
      ],
      [
        rehypePluginAutolinkHeadings,
        {
          properties: {
            class: 'header-anchor'
          },
          content: {
            type: 'text',
            value: '#'
          }
        }
      ]
    ]
  }) as unknown as Plugin
}
