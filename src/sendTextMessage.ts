/**
 * Slackにテキストメッセージを送信
 * 
 * @param {string} webhookUrl 送信したいチャンネルのwebhook url
 * @param {string} contentsText 送信するテキスト
 */
export const sendTextMessage = (webhookUrl: string, contentsText: string): GoogleAppsScript.URL_Fetch.HTTPResponse => {
    const options: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions =
    {
      "method" : "post",
      "contentType" : "application/json",
      "payload" : JSON.stringify(
        {
          "text" : contentsText,
          "link_names": 1
        }
      )
    };
  
    return UrlFetchApp.fetch(webhookUrl, options);
  };