
const { join } = require('path')
const APP_DIR = join(__dirname, 'src/view')
const BUILD_DIR = join(__dirname, 'src/view')

module.exports = {
  entry: join(APP_DIR, 'app.js'),
  output: {
    path: BUILD_DIR,
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [{
          loader: 'babel-loader',
          options: {
            presets: ['env']
          }
        }]
      }
    ]
  }
}