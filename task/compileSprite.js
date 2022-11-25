'use strict';
import { src, dest } from 'gulp';
import spritesmith from 'gulp.spritesmith';
import { _path } from '../package.json';


/*

  spriteImage  -----------------------------------------------

*/
export const compileSprite = (done) => {
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