# starterkit
ビルドツールは、基本的にgulpを使用しています。JSのみwepackを使用しています。
## 動作確認環境
* node 14.18.0
* gulp 4.0.2

## はじめに
以下コマンドを実行して必要なパッケージをインストールしてください。
```
npm install
```
## ファイル構成
* `package.json`
  * 依存するnpmパッケージに関する設定ファイルです。
* `gulpfile.esm.js`
  * gulp設定ファイルです。ESMで記述しています。
* `webpack.config.js`
  * webpackに関する設定ファイルです。
* `dist/`
  * Web公開されるファイルの置き場所です。
* `src/`, `src/images`, `src/scripts`, `src/styles`
  * ビルドに必要な各種ソースコード・画像ファイルなどです。
## 開発手順
開発時に必要なタスクは、gulpfile.esm.jsおよびwebpack.config.jsで管理されています。 shellから以下のコマンドを実行することで、各種ビルド・タスク実行が可能です。
```
gulp
```

## 対応ブラウザ
* 各種モダンブラウザ最新バージョン・IE11以上
  * 対応ブラウザを変更する場合、gulpfile.esm.jsとwebpack.config.jsの当該箇所を修正します。
