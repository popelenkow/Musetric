const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
 
module.exports = {
  entry: './src/react.tsx',
  target: 'electron-renderer',
  resolve: {
    extensions: ['.js', '.ts', '.tsx']
  },
  module: { rules: [{
    test: /\.ts(x?)$/,
    include: /src/,
    use: [{ loader: 'ts-loader' }]
  }] },
  output: {
    path: path.join(__dirname, '..', 'dist'),
    filename: 'react.js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    })
  ]
}
