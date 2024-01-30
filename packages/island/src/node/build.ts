import { build as viteBuild, InlineConfig } from 'vite';
import { CLIENT_ENTRY_PATH, SERVER_ENTRY_PATH } from './constants';
import { RollupOutput } from 'rollup';

export const CSRBuild = async (root: string) => {
  return viteBuild({
    root,
    mode: 'production',
    build: {
      outDir: 'build',
      rollupOptions: {
        input: CLIENT_ENTRY_PATH,
        output: {
          format: 'esm'
        }
      }
    }
  });
};

export const SSRBuild = async (root: string) => {
  return viteBuild({
    root,
    mode: 'production',
    build: {
      ssr: true,
      outDir: '.temp',
      rollupOptions: {
        input: SERVER_ENTRY_PATH,
        output: {
          format: 'cjs'
        }
      }
    }
  });
};

export const builder = async (root: string) => {
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
