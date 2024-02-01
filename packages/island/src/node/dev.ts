import { createServer } from 'vite';
import { PACKAGE_ROOT } from './constants';
import viteReact from '@vitejs/plugin-react';
import { pluginIndexHtml } from './plugin-island/indexhtml';

export const createDevServer = async (root: string = process.cwd()) => {
  return createServer({
    root: PACKAGE_ROOT,
    plugins: [pluginIndexHtml(), viteReact()]
  });
};
