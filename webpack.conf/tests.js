const webpack = require('webpack');
const merge = require('webpack-merge');
const base = require('./base.js');
const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;

module.exports = merge(base, {
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'istanbul-instrumenter-loader',
          options: {
            esModules: true,
            produceSourceMap: true
          }
        },
        enforce: 'post',
        exclude: /node_modules|\.spec\.js$/,
      }
    ]
  },  
  plugins: [
    // new CleanWebpackPlugin(['coverage'], {root: path.resolve('./')})
  ]
});