import path from 'path';
import glob from 'glob';
import _ from 'lodash';
//import filename from 'filename'
import TerserPlugin from 'terser-webpack-plugin';
import { browserslist } from './package.json';

const jsBasePath = path.resolve(__dirname, 'src/');

String.prototype.filename = function(){
  return this.match(".+/(.+?)([\?#;].*)?$")[1];
}

var targets = _.filter(glob.sync(`${jsBasePath}/**/*.js`), (item) => {
  //const libs = 'libs';
  //const re = new RegExp(`${item}/`);
  // console.info(item,item.includes('libs'))

  // libs以下は除外
  if ( !item.includes('libs') ){
    return item.filename()
  }
});

const entries = {};

targets.forEach(value => {
  const re = new RegExp(`${jsBasePath}/`);
  const key = value.filename().replace('.js','');

  // 確認用に取得したファイル名を出す
  //console.log('--------------------------')
  //console.log(value)
  //console.log(key)
  //console.log(value.filename()) 
  entries[key] = value;
  //console.log(entries) 
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
    //path: path.join(__dirname, 'dist/scripts/')
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
