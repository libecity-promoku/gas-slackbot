# Slackbot
Slackで暴れているbotくんのリポジトリです

## 環境構築

※nodeはv20推奨。v21以降だとビルド時にエラーを吐く。  
bugfixのissueは以下  
https://github.com/libecity-promoku/gas-slackbot/issues/8

```bash
$ npm i
# claspにlogin(~/.clasprcが生成される)
$ npx clasp login
```
claspのデプロイ設定をする
```bash
$ cp .clasp-dev.json.example .clasp-dev.json
```
scriptIdにはAppsScriptのIDを入れる。IDはAppScriptのプロジェクト設定 > IDにあるスクリプトID  

他の詳細はここ参照  
https://github.com/google/clasp#project-settings-file-claspjson

