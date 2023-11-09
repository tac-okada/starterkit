# starterkit
ビルドツールは、基本的にgulpを使用、JSのみwepackを使用しています。
## 動作環境
* node 20.8.1
* npm 10.1.0
* gulp 4.0.2

## はじめに
nodeとnpmのバージョン管理としてvoltaを導入しています。  
未インストールの場合は以下コマンドを実行してvoltaをインストールしてください。
```
curl https://get.volta.sh | bash
```

次に以下コマンドを実行して必要なパッケージをインストールすればOKです。
```
npm install
```
## ファイル構成
* `package.json`
  * 依存するnpmパッケージに関する設定ファイルです。
* `webpack.config.js`
  * webpackに関する設定ファイルです。
* `gulpfile.esm.js`
  * gulp設定ファイルです。ESMで記述しています。
* `task/`
  * gulp設定ファイルで使用している各種タスクファイルです。
* `public/`
  * Web公開されるファイルの置き場所です。
* `src/`, `src/images`, `src/scripts`, `src/styles`
  * ビルドに必要な各種ソースコード・画像ファイルなどです。
## 開発手順
開発時に必要なタスクは、gulpfile.esm.js（task/）およびwebpack.config.jsで管理されています。  
shellから以下のコマンドを実行することで、各種ビルド・タスク実行が可能です。
```
gulp
```
スプライト画像とスプライトSCSSの生成は以下コマンドで実行可能です。
```
gulp sprite
```
* 画像生成：`src/images/sprite/` ⇒ `src/images/sprite.png`
* scss生成： ⇒ `src/styles/_sprite.scss`

## 対応ブラウザ
* 各種モダンブラウザ最新バージョン・IE11以上
  * 対応ブラウザを変更する場合、package.jsonの`browserslist`を修正します。

## 使い方
### `scripts/libs/core.js`
Coreという名称で、従来のいわゆる「サイト共通JS」の役割となるクラスを一つ作成し、それを各JSファイルで継承しつつ、必要に応じて追加機能を実装する、という形にしています。
メソッドの一覧です。
* loadHandler
  * ページ読み込み時に実行
* resetHandler
  * 画面リサイズ時に実行
* scrollHandler
  * スクロール時に実行
* this.USER
  * USER情報を返します。ブラウザ、OS、画面解像度など。
  * またhtmlタグにブラウザ、OSなどをクラス名としてバインドします。
* this.win
  * 画面サイズなどの情報を返します。リサイズ・スクロール時に随時更新されます。

### `scripts/libs/modal.js`
レスポンシブ対応のモーダルウィンドウを生成します。
* JS読み込み時に以下を実行
```
let modal = new Modal;
modal.initialize(this);
```
* 仕組みについて
  * 上記実行時にhtml内のclass`js-modalOpen`をソートし、`data-modal`からモーダル用のDOMを生成します
* トリガー`js-modalOpen`について
  * `data-modal`に左から「__」区切りで、
  * [0]：固有番号【必須】 ※スライダーなどでトリガーが複製された場合の対応
  * [1]：種類：img/yt/iframe/dom【必須】
  * [2]：パラメータ【必須】：画像のパス／YoutubeID／iframeのパス／domのクラス名
  * youtube時のみdata-ytnumに固有番号【必須】
* トリガー`js-modalOpen`の使用例
```
<!--画像-->
<a class="js-modalOpen" data-modal="1__img__images/modal_dummy.gif" href="">→モーダルを開く</a>

<!--html内のdom要素（クラス「modal_dom」を取得して開く）-->
<a class="js-modalOpen" data-modal="2__dom__modal_dom" href="">→モーダルを開く</a><br>

<!--iframe（iframe_sample.htmlをiframeとして開く）-->
<a class="js-modalOpen" data-modal="3__iframe__iframe_sample.html" href="">→モーダルを開く</a>

<!--youtube（youtubeiframeAPIを使用してiframeとして開く）-->
<a class="js-modalOpen" data-modal="4__yt__t1rFmJMFdKw" data-ytnum="1" href="">→モーダルを開く</a>

<!--背景を押しても閉じない・強制視認（「data-noClose="true"」を指定する）-->
<a class="js-modalOpen" data-modal="3__iframe__iframe_sample.html" data-noClose="true" href="">モーダルを開く</a></p>
```
* モーダル内に閉じるボタンを実装する場合はクラス`js-modalClose`を付与してください
* [0]：固有番号はhtml内に一つだけです。重複するとエラーになります。スライダー系のプラグインでトリガーが複製された場合を考慮しています。
* スライダー系プラグイン内に実装する場合、プラグインのinitコマンド内で`modal.initialize(this);`を実行してください。プラグインのinit前に実行するとエラーになる場合があります。
