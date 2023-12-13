import { sendTextMessage } from "./sendTextMessage";
import { createWebhookUrlList } from "./createWebhookUrlList";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const doPost = (e: GoogleAppsScript.Events.DoPost) => {
  // イベントパラメータの取出し
  const params = JSON.parse(e.postData.contents);

  // SlackAPIからの所有確認
  if ('challenge' in params) {
    return ContentService.createTextOutput(params.challenge);
  }

  const postedUserName = params.event.user;

  // botの投稿に反応しないように
  if ('subtype' in params.event) return;
  
  const webhook_list = createWebhookUrlList();
  if (webhook_list === null) return; // webhook_listに記載がない場合は以下を処理しない。

  // **********
  // 以下、bot関係スクリプト
  // **********
  if('text' in params.event) {
    let contents = '';

    if(/^オウム返し/i.test(params.event.text)){
      contents = `<@${postedUserName}> You said \"${params.event.text}\"`;
    }

    sendTextMessage(webhook_list[params.event.channel], contents);
  }
};
