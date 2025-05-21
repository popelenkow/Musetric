import path from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import mkcert from 'vite-plugin-mkcert';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import musetricAppPackage from './package.json';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
    plugins: [
        react(),
        viteStaticCopy({
            targets: [
                { src: './node_modules/musetric/Resources/Icons.svg', dest: '' },
                { src: './package.json', dest: '' },
                { src: './readme.md', dest: '' },
                { src: '../license.md', dest: '' },
            ],
        }),
        mkcert(),
    ],
    build: {
        assetsDir: '',
        rollupOptions: {
            input: [
                path.resolve(__dirname, 'index.html'),
                path.resolve(__dirname, 'perf.html'),
            ],
        },
    },
    define: {
        APP_VERSION: JSON.stringify(musetricAppPackage.version),
    },
    resolve: {
        alias: mode !== 'development' ? undefined : {
            musetric: path.resolve(__dirname, '../musetric/src'),
        },
    },
    server: {
        host: '0.0.0.0',
        port: 3000,
        https: true,
        headers: {
            'Cross-Origin-Opener-Policy': 'same-origin',
            'Cross-Origin-Embedder-Policy': 'require-corp',
        },
        proxy: {
            '/api': {
                target: 'http://localhost:3001',
                changeOrigin: true,
                rewrite: (urlPath) => urlPath.replace(/^\/api/, ''),
            },
        },
    },
}));
