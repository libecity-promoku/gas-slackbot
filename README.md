# Slackbot
Slackで暴れているbotくんのリポジトリです

## 環境構築
```bash
$ npm i
# claspにlogin(~/.clasprcが生成される)
$ npx clasp login
```
claspのデプロイ設定をする
```bash
$ cp .clasp-dev.json.example .clasp-dev.json
```
scriptIdにはAppsScriptのIDを入れる。IDはGASのURLのここ↓の部分。
`https://script.google.com/home/projects/<ここがscriptId>/edit`
他の詳細はここ参照
https://github.com/google/clasp#project-settings-file-claspjson
