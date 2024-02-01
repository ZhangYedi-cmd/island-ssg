import { cac } from 'cac';

const version = require('../../package.json').version;
const cli = cac('ssg').version(version).help();

// 生产环境
cli
  .command('build [root]', 'build for production')
  .action(async (root: string) => {});

// 开发环境
cli
  .command('[root]', 'start dev server')
  .alias('dev')
  .action(async (root: string) => {
    // resolve config , start vite dev server
    const createServer = async () => {
      const { createDevServer } = await import('./dev');
      const server = await createDevServer(root);
      await server.listen();
      server.printUrls();
    };

    await createServer();
  });

cli.parse();
