import { Plugin } from 'vite'
import {SiteConfig} from "../../shared/types";

const SITE_ROUTE_ID = 'island:routes'
export const routePlugin = (
  config: SiteConfig
): Plugin => {
  return {
    name: 'island:routes',
    resolveId(id) {
      return SITE_ROUTE_ID === id ? '\0' + id : ''
    },
    load(id) {
      if (id === '\0' + SITE_ROUTE_ID) {
        return `export const routes = ${}`
      }
    }
  }
}
