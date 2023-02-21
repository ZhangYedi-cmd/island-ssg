import * as vite from 'vite';

declare function createDevServer(root?: string): Promise<vite.ViteDevServer>;

export { createDevServer };
