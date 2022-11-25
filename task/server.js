'use strict';
import { src, dest } from 'gulp';
import path from 'path';
import browserSync from 'browser-sync';
const reload = browserSync.reload;
import jschardet from 'jschardet';
import iconvLite from 'iconv-lite';
import fs from 'fs';
import minimist from 'minimist';
const options = minimist(process.argv.slice(2), {
  string: 'dir',
  default: {
    dir: 'public' // 引数の初期値
  }
});
import { _path } from '../package.json';


/*

  server  -----------------------------------------------

*/
export const serve = (done) => {
  let _dir;
  if( options.dir == 'src' ){
    _dir = ['.tmp', 'src'];
  } else if ( options.dir == 'public' ){
    _dir = 'public';
  }

  /* UTF-8 -> SJIS */
  const forSJIS = (req, res, next) => {
    // 仮想サーバーへのリクエストのurlが ~.htmlなら
    // index.htmlの時は / だけになる
    if (/\.html$/.test(req.url) || req.url === _path) {
      // ファイル読み込み
      let absPath = '';
      if(req.url === _path){
        absPath = path.join(__dirname, '../src' + _path, 'index.html' );
      }else{
        absPath = path.join(__dirname, '../src' + _path, req.url);
      }
      let data = fs.readFileSync(absPath);
      // 文字コード判定
      let charset = jschardet.detect(data)
  
      if (charset.encoding == 'SHIFT_JIS') {
        // shift-jisなら文字コード変換
        var source = iconvLite.decode(new Buffer(data, 'binary'), "Shift_JIS");
        res.setHeader("Content-Type", "text/html; charset=UTF-8");
        res.end(source);
      } else {
        // shift-jis以外は文字コード変換しない
        // public/にある.htaccessも削除しないと文字化けする
        next();
      }
    } else {
      next();
    }
  };

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
export const bsReload = (done) => {
  browserSync.reload();
  done();
}