import { oAuth2Client } from "util/oAuthClient";
import { getTokenServer } from "util/getTokenServer";

// スコープ設定 (読み取り専用)
const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];

export const upsetServerAndGetAuthUrl = (): string => {
  getTokenServer.listen(3000, () => {
    
  });
  // 認証用 URL を生成
  return oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
}