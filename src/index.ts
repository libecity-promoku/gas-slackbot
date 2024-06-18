import { sendTextMessage } from './sendTextMessage';
import { createWebhookUrlList } from './createWebhookUrlList';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const doPost = (e: GoogleAppsScript.Events.DoPost) => {
  // イベントパラメータの取出し
  const params = JSON.parse(e.postData.contents);

  // SlackAPIからの所有確認
  if ('challenge' in params) {
    return ContentService.createTextOutput(params.challenge);
  }

  // チャンネル生成のときに #general に通知
  if (params.event.type === 'channel_created') {
    const contents = `<@${params.event.channel.creator}> makes channel "#${params.event.channel.name}"`;

    // 投稿先 general固定
    // 'C04BBQE7RTJ': 'https://hooks.slack.com/services/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'
    sendTextMessage(
      'https://hooks.slack.com/services/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',
      contents
    );
    return;
  }

  // botの投稿に反応しないように
  if ('subtype' in params.event) return;

  const webhook_list = createWebhookUrlList();
  if (webhook_list === null) return; // webhook_listに記載がない場合は以下を処理しない。

  // webhook urlリストにないところからのを弾く
  if (!(params.event.channel in webhook_list)) return;

  const postedUserName = params.event.user;

  // **********
  // 以下、bot関係スクリプト
  // **********
  if ('text' in params.event) {
    let contents = '';

    // TEST: パラメータを全部出力
    if (/^debugall/i.test(params.event.text)) {
      contents = e.postData.contents;
    }

    if (params.event.text.includes('オウム返し')) {
      contents = `<@${postedUserName}> You said "${params.event.text}"`;
    }

    // 翻訳
    if (/^t: .+/.test(params.event.text)) {
      const rawTranslateText = /^t: /.exec(params.event.text);
      if (rawTranslateText === null) return;
      contents = LanguageApp.translate(rawTranslateText[1], '', 'ja');
    }

    if (params.event.text.includes('@slackbot ping')) {
      contents = `<@${postedUserName}> pong`;
    }

    if (/デデデ([1-9]|[1-9]\d+)連/i.test(params.event.text)) {
      const dededeStrings = [];
      const execResult = /デデデ([1-9]|[1-9]\d+)連/i.exec(params.event.text);
      if (execResult === null) return;
      const dededeCount = parseInt(execResult[1]);

      for (let i = 0; i < dededeCount; i++) {
        dededeStrings.push(dededeStringMaker());
      }

      if (/ssr確定\s?デ/i.test(params.event.text)) {
        // SSR確定時
        dededeStrings.splice(
          Math.floor(Math.random() * dededeCount),
          1,
          ':tada: :dedede: デデデ大王 :dedede: :tada:'
        );
      }

      if (dededeStrings.length > 20) {
        // 数が多い場合は簡易表示にする
        const dededeWiningCount = dededeStrings.filter(
          el => el === ':tada: :dedede: デデデ大王 :dedede: :tada:'
        ).length;
        contents = `:tada: :dedede: デデデ大王 :dedede: :tada: x ${dededeWiningCount}/${dededeCount}`;
      } else {
        contents = dededeStrings.join('\n');
      }
    }

    if (/^([1-9]\d*)D([1-9]\d*)$/i.test(params.event.text)) {
      // ここでﾀﾞｲｽの生成文字列だけ作っておく
      const diceRecipe = /^([1-9]\d*)D([1-9]\d*)$/i.exec(params.event.text);
      if (diceRecipe === null) return;
      contents = throwDice(diceRecipe[0]);
    }

    if (
      /^(0x[\dABCDEF]+|[1-9]\d*|0b[01]+)\sto\s(HEX|DEC|BIN)$/i.test(
        params.event.text
      )
    ) {
      contents = hexDecBinConverterByString(params.event.text);
    }

    sendTextMessage(webhook_list[params.event.channel], contents);
  }
};

const dededeStringMaker = (): string => {
  const daRow = ['ダ', 'ヂ', 'ヅ', 'デ', 'ド'];
  let dededeString = '';

  for (let i = 0; i < 3; i++) {
    const randomNum = Math.floor(Math.random() * 5);
    dededeString = dededeString + daRow[randomNum];
  }

  if (dededeString === 'デデデ') {
    return ':tada: :dedede: デデデ大王 :dedede: :tada:';
  }
  return dededeString + '大王';
};

const throwDice = (diceRecipe: string): string => {
  const diceRegex = /(\d+)d(\d+)/i.exec(diceRecipe);
  if (diceRegex === null) return '不正な入力です。';
  const diceCount = parseInt(diceRegex[1]);
  const maxNumberOfDice = parseInt(diceRegex[2]);

  const diceResult = [];

  for (let i = 0; i < diceCount; i++) {
    diceResult.push(Math.floor(Math.random() * maxNumberOfDice) + 1);
  }

  return `${diceResult.join(',')} \nsum: ${diceResult.reduce(
    (sum, element) => sum + element,
    0
  )}`;
};

const hexDecBinConverterByString = (numberString: string): string => {
  const regex = /^(0x[\dABCDEF]+|[1-9]\d*|0b[01]+)\sto\s(HEX|DEC|BIN)$/i;
  const execResult = regex.exec(numberString);
  if (execResult === null) return '不正な入力です。';
  const [, originalNumberString, baseNumberString] = execResult;

  const originalNumber = Number(originalNumberString);

  const baseNumberUpperString = baseNumberString.toUpperCase();
  const baseStringToNumber: { [key: string]: number } = {
    HEX: 16,
    DEC: 10,
    BIN: 2,
  };

  let returnString = '';

  switch (baseNumberUpperString) {
    case 'HEX':
      returnString = '0x';
      break;
    case 'BIN':
      returnString = '0b';
      break;
    default:
      break;
  }
  return (returnString += originalNumber
    .toString(baseStringToNumber[baseNumberUpperString])
    .toUpperCase());
};
