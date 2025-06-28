export const envs = {
  version: process.env.VERSION || '0.1.0',
  host: process.env.HOST || '0.0.0.0',
  port: process.env.PORT ? Number(process.env.PORT) : 3000,
  logLevel: process.env.LOG_LEVEL || 'info',
  protocol: process.env.PROTOCOL === 'http' ? 'http' : 'https',
};
