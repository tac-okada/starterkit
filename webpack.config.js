import path from 'path';
import glob from 'glob';
import TerserPlugin from 'terser-webpack-plugin';
import { browserslist } from './package.json';

const jsBasePath = path.resolve(__dirname, 'src/scripts/');

const targets = glob.sync(`${jsBasePath}/*.js`);
const entries = {};
targets.forEach(value => {
  const re = new RegExp(`${jsBasePath}/`);
  const key = value.replace(re, '').replace('.js','');
  entries[key] = value;
});

module.exports = {
  // production or development
  mode: 'production',

  optimization: {
    minimize: false,/* 圧縮 */
    minimizer: [new TerserPlugin({
      extractComments: false,/* ライセンステキスト出力しない */
    })],
  },

  entry: entries,//入力

  output: {//出力
    path: path.join(__dirname, 'dist/scripts/'),
    filename: '[name].min.js',
    clean: true
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', { targets: browserslist }]
            ]
          }
        }
      }
    ]
  }
};
