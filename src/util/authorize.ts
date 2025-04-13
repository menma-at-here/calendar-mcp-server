import fs from "fs";
import { OAuth2Client } from "google-auth-library";
import { TOKEN_PATH } from "./const";
import { oAuth2Client } from "./oAuthClient";
import { getTokenServer } from "./getTokenServer";

// スコープ設定 (読み取り専用)
const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];

export const shouldGetToken = (): boolean => {
  // token.json が存在しない場合、もしくはtokenが期限切れの場合、true を返す
  if (!fs.existsSync(TOKEN_PATH)) {
    return true;
  }
  const token = JSON.parse(fs.readFileSync(TOKEN_PATH, 'utf-8'));
  const expiryDate = token.expiry_date ? new Date(token.expiry_date) : null;
  if (expiryDate && expiryDate > new Date()) {
    return false; // トークンは有効
  }
  return true; // トークンは無効または存在しない
}

export const upsetServerAndGetAuthUrl = (): string => {
  getTokenServer.listen(3000, () => {
    
  });
  // 認証用 URL を生成
  return oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
}

// export const exchangeCodeForToken = async (code: string): Promise<OAuth2Client> => {
//   // 認証コードを用いてトークンを取得
//   const { tokens } = await oAuth2Client.getToken(code);
//   oAuth2Client.setCredentials(tokens);

//   // トークンをファイル保存
//   fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens));
//   console.log('Token stored to', TOKEN_PATH);

//   return oAuth2Client;
// }

// export const authorize = (): Promise<OAuth2Client> => {
//   // 既存の token.json があれば読み込み
//   if (fs.existsSync(TOKEN_PATH)) {
//     const token = JSON.parse(fs.readFileSync(TOKEN_PATH, 'utf-8'));
//     oAuth2Client.setCredentials(token);
//     return Promise.resolve(oAuth2Client);
//   } else {
//     // ない場合は新規に認証フローを行う
//     return getNewToken(oAuth2Client);
//   }
// }

// async function getNewToken(oAuth2Client: OAuth2Client): Promise<OAuth2Client> {
//   // 認証用 URL を生成
//   const authUrl = oAuth2Client.generateAuthUrl({
//     access_type: 'offline',
//     scope: SCOPES,
//   });
//   console.log('Authorize this app by visiting this url:', authUrl);

//   // CLI などで承認コード (code=...) を受け取るための簡易プロンプト例
//   // ※ 実際には Express サーバー等を立ち上げてリダイレクトを受け取る方法が一般的です
//   const rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout,
//   });

//   return new Promise((resolve, reject) => {
//     rl.question('Enter the code from that page here: ', async (code: string) => {
//       rl.close();
//       try {
//         const tokenResponse = await oAuth2Client.getToken(code);
//         oAuth2Client.setCredentials(tokenResponse.tokens);

//         // トークンをファイル保存
//         fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokenResponse.tokens));
//         console.log('Token stored to', TOKEN_PATH);

//         resolve(oAuth2Client);
//       } catch (err) {
//         console.error('Error retrieving access token', err);
//         reject(err);
//       }
//     });
//   });
// }