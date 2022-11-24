writing：okada
apdate：221028


【対応nodeバージョン】
　⇒11.15.0


【使い方】
----------------------------------------------------------------------

①gitから同期をとる

②サイトのルートに「cd」してnode_modulesのインストールを実行
$ npm install
※svnには「ignore」してください（addしない）。

③サイトのルートに「cd」して以下を実行
$ gulp
⇒ distディレクトリでサーバー起動

④app/以下で作業開始。
　※app/（作業領域）で修正したものはdist/（納品領域）に反映され、
　dist/以下が納品データとなります（dist以下は直接触らない）。


★CSSを編集する場合の注意点★ CSSについては、contents.scssがハブに
なっているため、contents.scssを更新しない限り修正は反映されません。
※例えば_common.scssを編集した場合も必ずcontents.scssを開き上書き保存する

----------------------------------------------------------------------


【gulpコマンドの説明】
----------------------------------------------------------------------

・対応gulpバージョン：4.0.2

$ gulp　もしくは　$ gulp --dir dist
⇒dist/ディレクトリでbrowserSyncが立ち上がる。
JSやCSSやimgはdist/以下（圧縮されたもの）を読む。
納品用のデータ。

$ gulp --dir app
⇒app/ディレクトリでbrowserSyncが立ち上がる。
JSやCSSは.tmp/のものを一時的に読み、imgとhtmlはapp/以下（未圧縮のもの）を読む。
表示速度が早く、簡単な修正確認などに使用する。

※browserSyncはSJISにも対応済み。ただし、SJIS以外の場合、dist直下の
.htaccessも削除しないとapacheで文字化けするので注意

----------------------------------------------------------------------

【以下、エラーが出る場合の対応など】
・nodeバージョンが異なりエラーが出る場合、
　以下の①〜④の手順で一時的にnodeバージョンを変更してください。
----------------------------------------------------------------------
※nodeのバージョン管理ツール「nvm」のインストール
$ git clone https://github.com/creationix/nvm.git ~/.nvm
$ source ~/.nvm/nvm.sh

①nodeバージョン一覧確認
$ nvm ls-remote

②nodeバージョン指定インストール
$ nvm install 7.8.0

③デフォルトのnodeバージョンを指定
※常にこのバージョンでnodeを使用する
$ nvm alias default v7.8.0

// 以下は必要に応じて
④~/.bash_profileを、ターミナル起動時に
バージョン指定（③で設定したnvmコマンド）が
常に適用されるように設定します。
1：以下で編集モードに入る
$ vi ~/.bash_profile

2：以下をコピペ。
----------------------------------
if [[ -s ~/.nvm/nvm.sh ]];
 then source ~/.nvm/nvm.sh
fi
----------------------------------

3：2が終わったらESC（エスケープ）キーを押す
（コマンドモードに切り替わる）。
最後に
$ :wq
と入力してエンターキーを押して保存。
----------------------------------------------------------------------
・nodeバージョンとプラグインのバージョンが
　異なりエラーが出る場合の対応方法（gulp-sassの例）
Error: `libsass` bindings not found. Try reinstalling `node-sass`?
----------------------------------------------------------------------
①gulp-sassのアンインストール
$ npm uninstall --save-dev gulp-sass

②gulp-sassの再インストール（末尾の「@2」のところでバージョンを指定する、
色々試してみてください…）
$ npm install --save-dev gulp-sass@2

③node-sassの再構築
$ npm rebuild node-sass

----------------------------------------------------------------------


【モーダルJSの使い方】
----------------------------------------------------------------------

①JSの実行
任意の箇所で以下を実行します。
modal.initModule()


②仕組みについて
①のJS実行時にページ内のclass「js-modalOpen」をソートし、
data-modalパラメータからモーダル用のDOMを生成します。
class「js-modalOpen」をトリガーとしてモーダルが起動します。


③トリガー「js-modalOpen」について
　⇒設置必須です。
--
例1：画像の場合
<a class="js-modalOpen data-modal="modal__2__img__images/modal_dummy.gif">モーダルテスト2</a>

例2：iframeの場合
<a class="js-modalOpen" data-modal="modal__3__iframe__iframe_test.html" href="">→モーダルを開く</a>

例3：Youtubeの場合
<a class="js-modalOpen" data-modal="modal__4__yt__t1rFmJMFdKw" href="">→モーダルを開く</a>

例4：フリーコンテンツの場合
<a class="js-modalOpen" data-modal="modal__2__free" data-ttl="">→モーダルを開く</a>
--

▼説明：data-modalにパラメータを記述します。
⇒左から「__」区切りで、
[0]：modal【固定値】【必須】
[1]：固有番号【必須】
　⇒同じ番号がページ内に存在する場合、同じ番号同士でグループ化されます。
　⇒グループの場合、「data-grp」にグループ内の番号（1〜）を付与する必要があります。
[2]：種類：img/yt/iframe/free【必須】
[3]：画像のパス、もしくはYoutubeのID


③Youtubeについて
・yt.api.jsの読み込みは必須です。
　⇒yt.api.jsにてiframeAPIに接続します。
・接続タイミングは現状modalJS実行時です。
　⇒setYoutube()の実行タイミング次第で変更可能です（要調整）。
・自動再生：定数「autoPlay」をtrueに設定することで対応可能。
・モーダルを閉じる際に動画停止、かつ先頭に戻る設定にしています。


④リサイズ（レスポンシブ対応）について
・Youtube以外の場合：
　⇒全てCSSで調整（レスポンシブ時の対応も）します。
・Youtubeの場合：
　⇒全てJSで調整します
　　⇒通常：横幅に対して縦幅を56.25%に固定
　　⇒縦幅がウィンドウサイズを下回った場合：縦幅：100%／横幅：177.7777%


⑤youtubeAPIをモーダル以外で使用したい場合
▼以下のように、youtubeDataにプッシュ⇒setYoutube()を実行する
----
html:
<a href="javascript:void(0);" id="movie01">MOVIE 01</a>
----
js:
$('#movie01').on('click', function(){
  youtubeData.push({
    youtubeIid: 'BlQY54GhLMM',
    embedArea: $(this).attr('id'),
    playerReady: false
  });
  setYoutube();
});
----


⑥その他
依存：jquery.js、user.js、youtubeAPI.js ★読み込み必須
トリガー：$(.js-modalOpen) ※HTML側で設置必須
表示領域：$(.modal_contents)
閉じるボタン：$(#modal_close)
背景：$(#modal_bg)
CSS：_modal.scss

----------------------------------------------------------------------


