const path = require('path');

module.exports = {
  entry: './src/beloader.js',
  output: {
    libraryTarget: 'umd'
  },
  module: {
    rules: [
      {
        test: /(\.jsx|\.js)$/,
        loader: 'babel-loader',
        exclude: /(node_modules|bower_components)/
      },
      {
        test: /(\.jsx|\.js)$/,
        loader: 'eslint-loader',
        exclude: /node_modules/,
        options: {
          fix: true,
        }
      },
      {
        test: /\.[cs]ss$/,
        use: [
          'style-loader',
          {
            loader : 'css-loader',              
            options: {
              minimize: true,
              sourceMap: false,
              importLoaders: 1
            }
          },
          'postcss-loader'
        ]
      },
      {
        test: /\.(html)$/,      
        use: {
          loader: 'html-loader',
          options: {
            minimize: true
          }
        }
      }
    ]
  },
  resolve: {
    modules: [path.resolve('./node_modules'), path.resolve('./src')],
    extensions: ['.json', '.js']
  },
}