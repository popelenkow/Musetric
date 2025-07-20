import { defineConfig } from 'vite';
import mkcert from 'vite-plugin-mkcert';

export default defineConfig({
  root: __dirname,
  base: './',
  plugins: [mkcert()],
  server: {
    host: '0.0.0.0',
    port: 3002,
  },
});
