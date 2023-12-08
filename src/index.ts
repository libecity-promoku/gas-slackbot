// eslint-disable-next-line @typescript-eslint/no-unused-vars
const doPost = (e: GoogleAppsScript.Events.DoPost) => {
  const params = e.parameters;
  const param = e.parameter;

  // SlackのEvent SubscriptionsでURL確認のためのリクエスト用
  if ('challenge' in params) {
    return ContentService.createTextOutput(param.challenge);
  }

  // Botの投稿に反応しないように
  if ('subtype' in params.event) return;
};
