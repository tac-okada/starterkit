/*
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: '/Applications/Chromium.app'
  });
  const page = await browser.newPage();
  page.setViewport({width: 1024, height: 800})
  const url = 'https://www.yahoo.co.jp/'
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  await page.screenshot({path: 'capture.png', fullPage:true})
  console.log("save screenshot: " + url)
  await browser.close()
})();
*/

const puppeteer = require('puppeteer');
const fs = require('fs');

// URLの一覧を読み込むファイルパス.
const URL_LIST_PATH = 'screenshot/url-list.txt';
// スクリーンショット出力先.
const SCREENSHOT_DIR = 'screenshot/capture';
// ビューポート設定.
const VIEWPORT = { width: 750, height: 1080, deviceScaleFactor: 1 };
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
    const browser = await puppeteer.launch();
    
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
        await page.goto(url);

        await wait(1000);

        // ページ内でJS実行.
        await page.evaluate(_ => {
            // クッキー同意ボタン押す.
/*
            const button = document.querySelector('[data-action="enable"]');
            if(button) {
                button.click();
            }
*/
            // 下までスクロールして戻す.
            scroll(0, 0);
/*
            setTimeout(() => {
                scroll(0, 0);
            }, 200);
*/
        });

        await page.screenshot({
            path: filePath,
            fullPage: true,
        });
        console.log(`screenshot: ${url}`);
        index++;
    }

    await browser.close();
    console.log('--- END ---');
})();