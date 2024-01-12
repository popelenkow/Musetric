import path from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import musetricAppPackage from './package.json';

export default defineConfig(() => ({
    plugins: [
        react(),
        viteStaticCopy({
            targets: [
                { src: './package.json', dest: '' },
                { src: './readme.md', dest: '' },
                { src: '../license.md', dest: '' },
            ],
        }),
    ],
    build: {
        assetsDir: '',
        rollupOptions: {
            input: {
                'index.html': path.resolve(__dirname, 'index.html'),
            },
        },
    },
    define: {
        APP_VERSION: JSON.stringify(musetricAppPackage.version),
    },
    server: {
        host: '0.0.0.0',
        port: 3000,
    },
}));
