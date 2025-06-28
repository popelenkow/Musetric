import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import mkcert from 'vite-plugin-mkcert';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  base: '/',
  mode: 'production',
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        { src: './package.json', dest: '' },
        { src: './readme.md', dest: '' },
      ],
    }),
    mkcert(),
  ],
  build: {
    target: 'es2022',
    assetsDir: '',
    chunkSizeWarningLimit: 1024,
    rollupOptions: {
      input: {
        index: 'index.html',
      },
    },
  },
  server: {
    host: '0.0.0.0',
    port: 3001,
    proxy: {
      '/api': {
        target: 'https://localhost:3000/',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
