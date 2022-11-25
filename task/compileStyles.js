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
import { _path } from '../package.json';
import { browserslist } from '../package.json';


/*

  css  -----------------------------------------------

*/
export const compileStyles = (done) => {
  // For best performance, don't add Sass partials to `gulp.src`
  return src([
    'src' + _path + 'styles/*.scss',
    'src' + _path + 'styles/**/*.css'
  ], { sourcemaps: true })
    .pipe(plumber())
    .pipe(changed('.tmp' + _path + 'styles', {extension: '.css'}))
    .pipe(sass({
      outputStyle: 'expanded',
      precision: 10,
      onError: console.error.bind(console, 'Sass error:')
    }))
    .pipe(postcss([
      autoprefixer({
        browsers: browserslist
      }),
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
    ]))
    .pipe(dest('.tmp' + _path + 'styles'))
    .pipe(dest('public' + _path + 'styles'))
    .pipe(size({title: 'styles'}));
  done();
};