'use strict';
import { src, dest, watch, parallel, series } from 'gulp';
import del from 'del';
import minimist from 'minimist';
const options = minimist(process.argv.slice(2), {
  string: 'dir',
  default: {
    dir: 'public' // 引数の初期値
  }
});
import { _path } from './package.json';


/*  js  */
import { compileJs } from "./task/compileJs.js"; 
exports.js = compileJs;


/*  images  */
import { compileImages } from "./task/compileImages.js"; 
exports.images = compileImages;


/*  copy  */
import { compileCopy } from "./task/compileCopy.js"; 
exports.copy = compileCopy;


/*  css  */
import { compileStyles } from "./task/compileStyles.js"; 
exports.css = compileStyles;


/*  server  */
import { serve, bsReload } from "./task/server.js"; 
exports.reload = bsReload;


/*  clean  */
const compileClean = (done) => {
  del(['.tmp', 'public' + _path + '*', '!public/.git']);
  done();
};
exports.clean = compileClean;


/*  spriteImage  */
import { compileSprite } from "./task/compileSprite.js"; 
exports.sprite = compileSprite;


/*  watch  */
const watchFiles = (done) => {
  if( options.dir == 'src' ){
    series(compileJs, compileStyles, serve, (done) => {
      done();
    })();
    watch(['src' + _path + 'images/**/*', '!src' + _path + 'images/webp/**/*'], series(bsReload));//コンパイルしない
    watch('src' + _path + '{,*/}*.html', series(bsReload));//コンパイルしない
  } else if ( options.dir == 'public' ){
    series(compileClean, compileCopy, compileJs, compileStyles, compileImages, serve, (done) => {
      done();
    })();
    watch(['src' + _path + 'images/**/*', '!src' + _path + 'images/webp/**/*'], series(compileImages, bsReload));
    watch('src' + _path + '{,*/}*.html', series(compileCopy, bsReload));
  }
  watch('src' + _path + 'styles/*.scss', series(compileStyles, bsReload));
  watch('src' + _path + 'scripts/**/*.js', series(compileJs, bsReload));
  done();
}
exports.watch = watchFiles;

// gulp --dir src or public
const combine = series(watchFiles, (done) => {
  done();
});
exports.default = combine;
