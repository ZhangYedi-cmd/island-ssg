import { createServer } from 'vite';
import { PACKAGE_ROOT } from './constants';

export const createDevServer = async (root: string = process.cwd()) => {
  return createServer({
    root: PACKAGE_ROOT,
    plugins: []
  });
};
