'use strict';
import { src, dest, watch, parallel, series } from 'gulp';
import del from 'del';
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
  del(['.tmp', 'public' + _path + '**/*.{html,css,js,json,jpg,png,gif,svg,webp}', '!**/*.git']);
  done();
};
exports.clean = compileClean;


/*  spriteImage  */
import { compileSprite } from "./task/compileSprite.js"; 
exports.sprite = compileSprite;


/*  watch  */
const watchFiles = (done) => {
  series(compileClean, compileCopy, compileJs, compileStyles, compileImages, serve,(done) => {
    done();
  })();
  watch(['src' + _path + '**/images/**/*.{gif,jpg,png,webp,svg}', '!src' + _path + '**/images/webp/**/*'], series(compileImages, bsReload));
  watch('src' + _path + '**/*.html', series(compileCopy, bsReload));
  watch('src' + _path + '**/*.scss', series(compileStyles, bsReload));
  watch('src' + _path + '**/*.js', series(compileJs, bsReload));
  done();
}
exports.watch = watchFiles;

// gulp --dir src or public
const combine = series(watchFiles, (done) => {
  done();
});
exports.default = combine;
