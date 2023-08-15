'use strict';
import imagemin from 'imagemin-keep-folder';
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
  await imagemin( ['src' + _path + '**/images/legacy/*.{gif,jpg,png}'], {
    use: [
      imageminWebp({ quality: 50 })
    ],
    replaceOutputDir: output => {
      return output.replace(/legacy\//, 'webp/')
    }
  });
  await imagemin( ['src' + _path + '**/images/**/*.{gif,jpg,png,webp,svg}'], {
    plugins: [
      imageminMozjpeg({ quality: 75 }),
      imageminPngquant({ quality: [0.3, 0.5] }),
      imageminGifsicle(),
      imageminSvgo({
        plugins: [
          { removeViewBox: false}
        ]
      })
    ],
    replaceOutputDir: output => {
      //console.info(output)
      return output.replace(/src\//, 'public/')
    }
  });
  done();
};