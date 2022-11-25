'use strict';
import { dest } from 'gulp';
import webpack from 'webpack';
import webpackStream from 'webpack-stream';
const webpackConfig = require('../webpack.config');
import { _path } from '../package.json';


/*

  js  -----------------------------------------------

*/
export const compileJs = (done) => {
  /* webpackStreamの第2引数にwebpackを渡す */
  return webpackStream(webpackConfig, webpack)
    .pipe(dest('public' + _path + 'scripts/'));
};