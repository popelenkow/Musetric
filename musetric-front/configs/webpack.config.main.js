const path = require('path');

module.exports = {
  entry: './src/electron.ts',
  target: 'electron-main',
  module: {
    rules: [{
      test: /\.ts$/,
      include: /src/,
      use: [{ loader: 'ts-loader' }]
    }]
  },
  output: {
    path: path.join(__dirname, '..', 'dist'),
    filename: 'electron.js'
  }
}
