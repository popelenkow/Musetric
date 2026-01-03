import { createServerApp } from './app.js';
import { killDevHost } from './common/dev.js';
import { envs } from './common/envs.js';

const startServer = async () => {
  const app = await createServerApp();
  try {
    await app.listen({
      port: envs.port,
      host: envs.host,
      listenTextResolver: (rawAddress) => {
        const address = rawAddress.replace('127.0.0.1', 'localhost');
        return `Server: ${address}\tSwagger: ${address}/docs`;
      },
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes('EADDRINUSE')) {
      console.error(`Port ${envs.port} is already in use`);
      killDevHost();
      process.exit(1);
    }
    throw error;
  }
};

await startServer();
