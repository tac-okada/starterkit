'use strict';
import { dest } from 'gulp';
import webpack from 'webpack';
import webpackStream from 'webpack-stream';
const webpackConfig = require('../webpack.config');
const rename = require('gulp-rename');
import { _path } from '../package.json';
import path from 'path';
let pubricPath;
let length = 0;

/*

  js  -----------------------------------------------

*/
export const compileJs = (done) => {
  /* webpackStreamの第2引数にwebpackを渡す */
  return webpackStream(webpackConfig, webpack)
    // 書き出し先のパスをwebpackConfig.entry[length]から抽出しsrc/以下を切り出し
    .pipe(dest(function (){
      pubricPath = path.dirname(Object.values(webpackConfig.entry)[length])
      pubricPath = pubricPath.substring(pubricPath.indexOf('src/')).replace('src/', '');
      //console.info(pubricPath)
      length++;
      return 'public/' + pubricPath;
      
    }))

};