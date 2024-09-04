const puppeteer = require('puppeteer');
const fs = require('fs');

// URLの一覧を読み込むファイルパス.
const URL_LIST_PATH = 'screenshot/url-list.txt';

// スクリーンショット出力先.
const SCREENSHOT_DIR = 'screenshot/capture';

// ビューポート設定.
const VIEWPORT = {
  width: 750,
  height: 1080,
  deviceScaleFactor: 1
};

// 時間差設定用
function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

(async () => {
    console.log('--- START ---');
    // URLのリストをテキストファイルから取得.
    const text = fs.readFileSync(URL_LIST_PATH, 'utf8');
    const urlList = text.toString().split(/\n/);

    // 出力先の準備.
    if(fs.existsSync(SCREENSHOT_DIR)) {
        fs.rmSync(SCREENSHOT_DIR, { recursive: true, force: true }); 
    }
    fs.mkdirSync(SCREENSHOT_DIR);
    
    // Puppeteer 起動！
    const browser = await puppeteer.launch({
      headless: true,
      //slowMo: 1000
      //executablePath: '/Applications/Chromium.app/Contents/MacOS/Chromium'
    });
    
    // ページごとにスクショ作成
    let index = 1;
    for (key in urlList) {
        const url = urlList[key];
        // ファイル保存先.
        const fileName = `000${index}`.slice(-3);
        const filePath = `./${SCREENSHOT_DIR}/${fileName}.png`;

        // 設定等
        const page = await browser.newPage();
        await page.setViewport(VIEWPORT);
        if(!url) {
            continue;
        }
        await page.goto(url, { waitUntil: 'domcontentloaded' });

        // 2秒待つ（ローディングが終わるまで）
        await wait(2000);

        // ページ内でJS実行.
        await page.evaluate(_ => {
          // MYページのボタンを下に固定
          const myScan = document.querySelector('.myScan');
          if( myScan ){
            myScan.classList.remove('stiky_area');
          }

          // TOPページのボタンを下に固定
          const topEntry = document.querySelector('.topEntry');
          if( topEntry ){
            topEntry.classList.remove('stiky_area');
          }

          // モーダルが開いていたら消す
          const modal = document.querySelector('.modal_contents.active');
          const modalClose = document.querySelector('#modal_close');
          const modalBg = document.querySelector('#modal_bg');
          if( modal ){
            modal.parentNode.removeChild(modal);
            modalClose.parentNode.removeChild(modalClose);
            modalBg.parentNode.removeChild(modalBg);
            document.body.classList.remove('fixed');
          }

          // 下までスクロール
/*
          setTimeout(() => {
            window.scrollTo(0, document.body.scrollHeight);
          }, 100);
*/

        });

        // 1秒待つ
        await wait(1000);

        // スクリーンショット撮影！
        await page.screenshot({
            path: filePath,
            fullPage: true
        });
        console.log(`screenshot: ${url}`);
        index++;

        // ページ閉じる
        await page.close();
    }

    await browser.close();
    console.log('--- END ---');
})();