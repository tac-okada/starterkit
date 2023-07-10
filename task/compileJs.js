'use strict';
import { dest } from 'gulp';
import webpack from 'webpack';
import webpackStream from 'webpack-stream';
const webpackConfig = require('../webpack.config');
import { _path } from '../package.json';
import path from 'path';
let pubricPath;

/*

  js  -----------------------------------------------

*/
export const compileJs = (done) => {
  let length = 0;
  /* webpackStreamの第2引数にwebpackを渡す */
  return webpackStream(webpackConfig, webpack)
    // 書き出し先のパスをwebpackConfig.entry[length]から抽出しsrc/以下をpubricPathに切り出し
    .pipe(dest( ()=> {
      //console.info(webpackConfig.entry,length)
      pubricPath = path.dirname(Object.values(webpackConfig.entry)[length])
      pubricPath = pubricPath.substring(pubricPath.indexOf('src/')).replace('src/', '');
      //console.info(pubricPath)
      length++;
      return 'public/' + pubricPath;
    }))
};