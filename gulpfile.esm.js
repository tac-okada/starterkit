'use strict';
import { src, dest, watch, parallel, series } from 'gulp';
import webpack from 'webpack';
import webpackStream from 'webpack-stream';
const webpackConfig = require('./webpack.config');
import dartSass from 'sass';
import gulpSass from 'gulp-sass';
const sass = gulpSass( dartSass );
import rename from 'gulp-rename';
import browserSync from 'browser-sync';
import concat from 'gulp-concat';
import uglify from 'gulp-uglify';
import plumber from 'gulp-plumber';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import stylelint from 'stylelint';
import imagemin from 'imagemin';
import imageminMozjpeg from 'imagemin-mozjpeg';
import imageminPngquant from 'imagemin-pngquant';
import imageminGifsicle from 'imagemin-gifsicle';
import imageminSvgo from 'imagemin-svgo';
import imageminWebp from 'imagemin-webp';
import size from 'gulp-size';
import changed from 'gulp-changed';
import jschardet from 'jschardet';
import iconvLite from 'iconv-lite';
import path from 'path';
import url from 'url';
import fs from 'fs';
import del from 'del';
import babel from 'gulp-babel';
const reload = browserSync.reload;
import spritesmith from 'gulp.spritesmith';
const _path = '/';
import minimist from 'minimist';
const options = minimist(process.argv.slice(2), {
  string: 'dir',
  default: {
    dir: 'dist' // 引数の初期値
  }
});


/* ie11以上、android4以上、その他は2バージョン前まで */
const AUTOPREFIXER_BROWSERS = [
  'last 2 versions',
  'ie >= 11',
  'Android >= 4'
];


/*

  js  -----------------------------------------------

*/
const compileJs = (done) => {
  /* webpackStreamの第2引数にwebpackを渡す */
  return webpackStream(webpackConfig, webpack)
    .pipe(dest('dist' + _path + 'scripts/'));
};


/*

  images  -----------------------------------------------

*/
const compileImages = async (done) => {
  await imagemin( ['src' + _path + 'images/legacy/**/*'], {
    destination: 'src' + _path + 'images/webp/',
    plugins: [
      imageminWebp({ quality: 50 })
    ]
  });
  await imagemin( ['src' + _path + 'images/**/*'], {
    destination: 'dist' + _path + 'images',
    plugins: [
      imageminMozjpeg({ quality: 75 }),
      imageminPngquant({ quality: [0.3, 0.5] }),
      imageminGifsicle(),
      imageminSvgo({
        plugins: [
          { removeViewBox: false}
        ]
      })
    ]
  });
  done();
};
exports.images = compileImages;

const compileCopy = (done) => {
  return src([
    'src' + _path + '**/*',
    '!src' + _path + '**/*.ejs',
    '!src' + _path + 'scripts/*',
    '!src' + _path + 'scripts/libs/**/*',
    '!src' + _path + 'styles/*'
/*,
    'node_modules/apache-server-configs/dist/.htaccess'
*/
  ], {
    dot: true
  }).pipe(dest('dist' + _path))
    .pipe(size({title: 'copy'}));
  done();
};
exports.copy = compileCopy;


/*

  css  -----------------------------------------------

*/
const compileStyles = (done) => {
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
        browsers: AUTOPREFIXER_BROWSERS
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
    .pipe(dest('dist' + _path + 'styles'))
    .pipe(size({title: 'styles'}));
  done();
};
exports.css = compileStyles;


/*

  clean  -----------------------------------------------

*/
const compileClean = (done) => {
  del(['.tmp', 'dist' + _path + '*', '!dist/.git']);
  done();
};
exports.clean = compileClean;


/*

  UTF-8 -> SJIS  -----------------------------------------------

*/
const forSJIS = (req, res, next) => {
  // 仮想サーバーへのリクエストのurlが ~.htmlなら
  // index.htmlの時は / だけになる
  if (/\.html$/.test(req.url) || req.url === _path) {
    // ファイル読み込み
    var absPath = '';
    if(req.url === _path){
      absPath = path.join(__dirname, 'src' + _path, 'index.html' );
    }else{
      absPath = path.join(__dirname, 'src' + _path, req.url);
    }
    var data = fs.readFileSync(absPath);
    // 文字コード判定
    var charset = jschardet.detect(data)

    if (charset.encoding == 'SHIFT_JIS') {
      // shift-jisなら文字コード変換
      var source = iconvLite.decode(new Buffer(data, 'binary'), "Shift_JIS");
      res.setHeader("Content-Type", "text/html; charset=UTF-8");
      res.end(source);
    } else {
      // shift-jis以外は文字コード変換しない
      // dist/にある.htaccessも削除しないと文字化けする
      next();
    }
  } else {
    next();
  }
};


/*

  server  -----------------------------------------------

*/
const server = (done) => {
  let _dir;
  if( options.dir == 'src' ){
    _dir = ['.tmp', 'src'];
  } else if ( options.dir == 'dist' ){
    _dir = 'dist';
  }

  browserSync.init({
    notify: false,
    server: {
      baseDir: _dir,// ['.tmp', 'src'],
      middleware: [
        function (req, res, next) {
          forSJIS (req, res, next)
        }
      ]
    }
  });
  done();
};


/*

  reload  -----------------------------------------------

*/
const bsReload = (done) => {
  browserSync.reload();
  done();
}
exports.reload = bsReload;


/*

  watch  -----------------------------------------------

*/
const watchFiles = (done) => {
  if( options.dir == 'src' ){
    series(compileJs, compileStyles, server, (done) => {
      done();
    })();
    watch(['src' + _path + 'images/**/*', '!src' + _path + 'images/webp/**/*'], series(bsReload));//コンパイルしない
    watch('src' + _path + '{,*/}*.html', series(bsReload));//コンパイルしない
  } else if ( options.dir == 'dist' ){
    series(compileClean, compileCopy, compileJs, compileStyles, compileImages, server, (done) => {
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

// gulp --dir src or dist
const combine = series(watchFiles, (done) => {
  done();
});
exports.default = combine;


/*

  spriteImage  -----------------------------------------------

*/
const compileSprite = (done) => {
  let spriteData = src('src' + _path + 'images/sprite/*.{jpg,gif,png}') //スプライトにする画像
  .pipe(spritesmith({
    imgName: 'sprite.png', //スプライトの画像
    cssName: '_sprite.scss', //生成されるscss
    imgPath: '/images/sprite.png', //生成されるscssに記載されるパス
    cssFormat: 'scss', //フォーマット
    algorithm: 'diagonal', //並び方
    cssVarMap: function (sprite) {
      sprite.name = 'sprite-' + sprite.name; //VarMap(生成されるScssにいろいろな変数の一覧を生成)
    }
  }));
  spriteData.img.pipe(dest('src' + _path + 'images/')); //imgNameで指定したスプライト画像の保存先
  spriteData.css.pipe(dest('src' + _path + 'styles/')); //cssNameで指定したcssの保存先
  done();
};
exports.sprite = compileSprite;