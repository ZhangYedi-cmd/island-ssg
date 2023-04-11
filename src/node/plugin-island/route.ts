import { SiteConfig } from '../../shared/types'
import { Plugin } from 'vite'
import path from 'path'
import fs from 'fs'
import { DOCS_PATH, PACKAGE_ROOT } from '../constants';

export type Route = {
  path: string
  fsPath: string
  children: Route[]
}

/**
 * 根据文件目录自动映射为路由配置
 * @param config
 */
export const buildFileTree = (root: string) => {
  const routePath = root.replace(__dirname, '') || '/'
  const files = fs.readdirSync(root);
  const rootNode = {
    path: routePath,
    fsPath: root,
    children: []
  };

  files.forEach((file) => {
    const filePath = path.join(root, file);
    const fileRoutePath = filePath
      .replace(__dirname, '')
      .replace(/\.(\w+)/g, '')
    const isDir = fs.statSync(filePath).isDirectory();
    if (isDir) {
      rootNode.children.push(buildFileTree(filePath));
    } else {
      rootNode.children.push({
        routePath: fileRoutePath,
        fsPath: file,
        children: []
      });
    }
  });
  return rootNode;
}

const SITE_DATA_ID = 'island:site-routes'

/**
 * 路由插件
 * @param config
 */
export const routePlugin = (): Plugin => {
  return {
    name: 'island:site-routes',
    load(id) {
      if (id === SITE_DATA_ID) {
        return '\0' + SITE_DATA_ID
      }
    },
    resolveId(id) {
      if (id === '\0' + SITE_DATA_ID) {
        return 'export const routes = []';
      }
    }
  }
}
