import fs from "fs";
import { TOKEN_PATH } from "util/const";
import { oAuth2Client } from "util/oAuthClient";
import { getTokenServer } from "util/getTokenServer";

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