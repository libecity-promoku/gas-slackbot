/**
 * Webhook URLのリストを作成
 */
export const createWebhookUrlList = (): { [key: string]: string } | null => {
  // スクリプトプロパティからスプレッドシートIDを取得
  const spreadSheetId =
    PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID');
  // スプレッドシートIDからシートを取得
  const sheet = SpreadsheetApp.openById(spreadSheetId!).getSheetByName(
    'webhook_url_list'
  );
  // シートが存在しない場合はnullを返す
  if (null === sheet) return null;

  const dataRange = sheet.getDataRange();
  const values = dataRange.getValues();

  // 最初の行をヘッダーとして扱い、データの開始を2行目にする
  const headers = values[0];
  const channelIndex = headers.indexOf('channel_id');
  const webhookIndex = headers.indexOf('webhook_url');

  const webhookList: { [key: string]: string } = {};

  // 2行目から最終行までループ
  for (let i = 1; i < values.length; i++) {
    const row = values[i];
    const channelId = row[channelIndex];
    const webhookUrl = row[webhookIndex];

    webhookList[channelId] = webhookUrl;
  }

  return webhookList;
};
