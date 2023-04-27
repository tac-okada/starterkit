# starterkit
ビルドツールは、基本的にgulpを使用、JSのみwepackを使用しています。
## 動作環境
* node 14.21.1
* npm 6.14.17
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
# modal.js
    `let modal = new Modal;`
    `modal.initialize(this);`
