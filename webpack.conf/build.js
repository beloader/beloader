const webpack = require('webpack');
const path = require('path');
const merge = require('webpack-merge');
const base = require('./base.js');
const UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = merge(base, {
  devtool: false,
  output: {
    path: path.resolve('./dist'),
    filename: 'beloader.min.js',
    chunkFilename: 'modules/[name].min.js'
  },
  plugins: [
    new CleanWebpackPlugin(['dist'], {root: path.resolve('./')}),
    new UglifyJsPlugin({
      sourceMap: false,
      output: {comments: false}
    }),
    // new BundleAnalyzerPlugin(),
    new webpack.optimize.ModuleConcatenationPlugin()
  ]
});
