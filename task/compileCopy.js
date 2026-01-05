'use strict';
import { src, dest, watch, parallel, series } from 'gulp';
import size from 'gulp-size';
import { _path } from '../package.json';


/*

  copy  -----------------------------------------------

*/
export const compileCopy = (done) => {
  return src([
    'src' + _path + '**/*',
    '!src' + _path + '**/*.DS_Store',
    '!src' + _path + '**/*.ejs',
    '!src' + _path + '**/scripts/**/*',
    '!src' + _path + '**/images/**/*',
    '!src' + _path + '**/styles/**/*'
/*,
    'node_modules/apache-server-configs/public/.htaccess'
*/
  ], {
    dot: true
  }).pipe(dest('public' + _path))
    .pipe(size({title: 'copy'}));
  done();
};