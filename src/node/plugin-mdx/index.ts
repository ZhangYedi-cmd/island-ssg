import { Plugin } from 'vite'
import { pluginMdxRollup } from './pluginMdxRollup'

export async function createPluginMdx(): Plugin[] {
  return [await pluginMdxRollup()]
}
