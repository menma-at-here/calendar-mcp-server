import http from 'http';
import fs from 'fs';
import { oAuth2Client } from 'util/oAuthClient';
import { TOKEN_PATH } from 'util/const';

export const getTokenServer = http.createServer(async (req, res) => {
  if (req?.url?.startsWith('/callback')) {
    // クエリパラメータから code を取り出す
    const urlObj = new URL(req.url, 'http://localhost:3000');
    const code = urlObj.searchParams.get('code');
    if (code) {
      // コードからトークンを取得
      const { tokens } = await oAuth2Client.getToken(code);
      oAuth2Client.setCredentials(tokens);

      // トークンをファイル等に保存
      fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens));
      // console.log('Token stored to', TOKEN_PATH);

      // レスポンスを返して、リダイレクト後の画面を終了
      res.end('Authentication successful! You can close this tab.');
      getTokenServer.close();
    } else {
      res.end('No code found!');
    }
  } else {
    res.end('Not Found');
  }
});