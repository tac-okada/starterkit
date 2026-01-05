'use strict';
import { src, dest } from 'gulp';
import dartSass from 'sass';
import gulpSass from 'gulp-sass';
const sass = gulpSass( dartSass );
import plumber from 'gulp-plumber';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import stylelint from 'stylelint';
import size from 'gulp-size';
import changed from 'gulp-changed';
import tailwindcss from 'tailwindcss';
import path from 'path';
import { _path } from '../package.json';
let pubricPath;

const getPath = file => {
  //console.info(file)
  // 書き出し先のパスをfile.pathから抽出しsrc/styles以下を__pathに切り出し
  let __path = file.path.split('/').reverse().slice(1).reverse().join('/');
    __path = __path.substring(__path.indexOf('src/')).replace('src/', '');
    __path = __path.substring(__path.indexOf('styles')).replace('styles', '');
  //console.info(__path)
  return __path
}

/*

  css  -----------------------------------------------

*/
export const compileStyles = (done) => {
  // For best performance, don't add Sass partials to `gulp.src`
  return src([
    'src' + _path + '**/*.scss',
    'src' + _path + '**/*.css',
  ], { sourcemaps: true })
    .pipe(plumber({
      errorHandler: function(err) {
        console.log(err);
        this.emit('end');
      }
    }))
    //.pipe(changed('.tmp' + _path + 'styles', {extension: '.css'}))
    .pipe(sass({
      outputStyle: 'expanded',
      precision: 10,
      onError: console.error.bind(console, 'Sass error:')
    }))
    .pipe(postcss([
      tailwindcss(),
      autoprefixer(),
/*
      stylelint({
        "rules": { 
          // 16進数が正しいか
          "color-no-invalid-hex": true,
          // fontファミリー重複があるか
          "font-family-no-duplicate-names": true,
          // calc()の表記が間違っていないか
          "function-calc-no-invalid": true,
          // セレクタ指定内にプロパティがない場合にエラー
          "block-no-empty": true,
          // プロパティ末尾にセミコロンがあるか
          "declaration-block-trailing-semicolon": "always"
        }
      })
*/
    ]))
    //.pipe(dest('.tmp' + _path + 'styles'))
    .pipe(dest( file => {
      return 'public' + _path + getPath(file);
    }))
    .pipe(size({title: 'styles'}));
  done();
};