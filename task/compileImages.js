'use strict';
import imagemin from 'imagemin';
import imageminMozjpeg from 'imagemin-mozjpeg';
import imageminPngquant from 'imagemin-pngquant';
import imageminGifsicle from 'imagemin-gifsicle';
import imageminSvgo from 'imagemin-svgo';
import imageminWebp from 'imagemin-webp';
import { _path } from '../package.json';

/*

  images  -----------------------------------------------

*/
export const compileImages = async (done) => {
  await imagemin( ['src' + _path + 'images/legacy/**/*'], {
    destination: 'src' + _path + 'images/webp/',
    plugins: [
      imageminWebp({ quality: 50 })
    ]
  });
  await imagemin( ['src' + _path + 'images/**/*'], {
    destination: 'public' + _path + 'images',
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