
const { join } = require('path')
const APP_DIR = join(__dirname, 'src/view/public')
const BUILD_DIR = join(__dirname, 'src/view/public')

module.exports = {
  entry: {
    app: join(APP_DIR, 'app.js')
  },
  output: {
    path: BUILD_DIR,
    filename: '[name].bundle.js'
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