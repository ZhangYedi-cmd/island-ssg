import * as vite from 'vite';

declare function createDevServer(root: string, restartDevServer: any): Promise<vite.ViteDevServer>;

export { createDevServer };
