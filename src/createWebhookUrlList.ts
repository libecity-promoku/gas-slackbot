/**
 * Webhook URLのリストを作成
 */
export const createWebhookUrlList = () => {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('webhook_url_list');
  if (null === sheet) return null;
  const dataRange = sheet.getDataRange();
  const values = dataRange.getValues();

  // 最初の行をヘッダーとして扱い、データの開始を2行目にする
  const headers = values[0];
  const channelIndex = headers.indexOf('channel_id');
  const webhookIndex = headers.indexOf('webhook_url');

  let webhookList: {[key: string]: string} = {};

  // 2行目から最終行までループ
  for (let i = 1; i < values.length; i++) {
    let row = values[i];
    let channelId = row[channelIndex];
    let webhookUrl = row[webhookIndex];
    
    webhookList[channelId] = webhookUrl;
  }

  return webhookList;
};