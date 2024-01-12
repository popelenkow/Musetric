/** @typedef {import("webpack").Configuration} Configuration */
/** @typedef {import("webpack-dev-server").Configuration} DevServerConfiguration */

const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');
const { merge } = require('webpack-merge');
const WorkerUrlPlugin = require('worker-url/plugin');
const { createDtsBundlePlugin } = require('./DtsBundlePlugin');
const musetricAppPkg = require('./package.json');

const createConfig = (env, options) => {
    /** @type {Configuration} */
    const common = {
        resolve: {
            extensions: ['.js', '.ts', '.tsx'],
            modules: [
                path.resolve(__dirname, './src'),
                path.resolve(__dirname, './node_modules'),
            ],
        },
        module: {
            rules: [
                {
                    test: /\.(ts|tsx)$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'ts-loader',
                        options: {
                            projectReferences: true,
                        },
                    },
                },
            ],
        },
        output: {
            publicPath: '/',
            path: path.resolve(__dirname, 'dist'),
            filename: '[name].js',
        },
        performance: {
            maxEntrypointSize: 3 * 1024 * 1024,
            maxAssetSize: 3 * 1024 * 1024,
        },
        stats: { modules: false, children: false, entrypoints: false },
        plugins: [
            new webpack.DefinePlugin({
                'process.env': {
                    APP_VERSION: JSON.stringify(musetricAppPkg.version),
                },
            }),
            new WorkerUrlPlugin(),
        ],
    };

    /** @type {Configuration} */
    const specific = env.dev ? {
        mode: 'development',
        devtool: 'source-map',
        /** @type {DevServerConfiguration} */
        devServer: {
            port: 3000,
            headers: {
                'Cross-Origin-Opener-Policy': 'same-origin',
                'Cross-Origin-Embedder-Policy': 'require-corp',
            },
        },
        plugins: [
            new webpack.ProgressPlugin(),
        ],
        stats: { assets: false },
    } : {
        mode: 'production',
    };
    return merge(common, options, specific);
};

const createConfigs = (env, args) => {
    const configs = args.map((x) => createConfig(env, x));
    for (let i = 0; i < configs.length; i++) {
        if (i !== 0) delete configs[i].devServer;
    }
    return configs;
};

const create = (env) => {
    /** @type {Configuration} */
    const musetric = {
        entry: {
            MusetricTheme: './src/Theme.ts',
            MusetricLocale: './src/Locale.ts',
            MusetricApp: './src/App.tsx',
        },
        output: {
            library: {
                type: 'umd',
            },
        },
        plugins: env.dev ? [] : [
            createDtsBundlePlugin(),
        ],
    };
    /** @type {Configuration} */
    const others = {
        entry: {
            MusetricSplashScreen: './src/SplashScreen.ts',
            perf: './src/perf.ts',
            index: './src/index.ts',
        },
        plugins: [
            new CopyPlugin({
                patterns: [
                    { from: './src/index.html', to: './index.html' },
                    { from: './src/perf.html', to: './perf.html' },
                    { from: '../musetric/src/Resources/Icons.svg', to: './Icons.svg' },
                    { from: './src/favicon.ico', to: './favicon.ico' },
                    { from: './package.json', to: './package.json' },
                    { from: '../license.md', to: './license.md' },
                    { from: './readme.md', to: './readme.md' },
                ],
            }),
        ],
    };
    return createConfigs(env, [others, musetric]);
};

module.exports = create;
