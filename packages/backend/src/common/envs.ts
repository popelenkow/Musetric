export const envs = {
  version: process.env.VERSION || '0.1.0',
  host: process.env.HOST || '0.0.0.0',
  port: process.env.PORT ? Number(process.env.PORT) : 3001,
  logLevel: process.env.LOG_LEVEL || 'info',
};
