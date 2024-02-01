import { build as viteBuild, InlineConfig } from 'vite';
import { CLIENT_ENTRY_PATH, SERVER_ENTRY_PATH } from './constants';
import { RollupOutput } from 'rollup';
import { join } from 'path';
import { renderPage } from './renderPage';

export const bundle = async (root: string) => {
  const resolveBuildConfig = async (
    isServer: boolean
  ): Promise<InlineConfig> => ({
    root,
    mode: 'production',
    build: {
      ssr: true,
      outDir: isServer ? '.temp' : 'build',
      rollupOptions: {
        input: isServer ? SERVER_ENTRY_PATH : CLIENT_ENTRY_PATH,
        output: {
          format: isServer ? 'cjs' : 'esm'
        }
      }
    }
  });

  const clientBuild = async () => viteBuild(await resolveBuildConfig(false));
  const serverBuild = async () => viteBuild(await resolveBuildConfig(true));

  const [clientBundle, serverBundle] = await Promise.all([
    clientBuild(),
    serverBuild()
  ]);

  return [clientBundle, serverBundle] as [RollupOutput, RollupOutput];
};

export const SSGBuild = async (root: string) => {
  const [clientBundle] = await bundle(root);
  const serverEntryPath = join(root, '.temp/server/server-entry.js');
  const { render } = await import(serverEntryPath);

  await renderPage(root, render, clientBundle);
};
