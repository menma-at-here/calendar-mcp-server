import { google } from "googleapis";
import fs from "fs";
import { TOKEN_PATH } from "util/const";
import { oAuth2Client } from "util/oAuthClient";

// const getCurrentWeekRange = () => {
//   const now = new Date();
//   // JS の getDay(): 日曜 = 0, 月曜=1, ... 土曜=6
//   // 月曜始まりにしたいので、(getDay() + 6) % 7 が月曜=0 となる形をとる。
//   const dayOfWeek = (now.getDay() + 6) % 7; // 月曜=0, 火曜=1, ... 日曜=6

//   // 月曜の日付を計算
//   const monday = new Date(now);
//   monday.setDate(now.getDate() - dayOfWeek);
//   monday.setHours(0, 0, 0, 0); // 00:00:00

//   // 日曜の日付を計算
//   const sunday = new Date(monday);
//   sunday.setDate(monday.getDate() + 6);
//   sunday.setHours(23, 59, 59, 999);

//   // UTC に変換 (必須ではありませんが、ズレを避けるために推奨)
//   const startUTC = monday.toISOString();
//   const endUTC = sunday.toISOString();

//   return { start: startUTC, end: endUTC };
// }

export async function getCalendarWithToken(start: Date, end: Date): Promise<any> {
  try {
    
    // トークンの有効期限をチェック
    // const expiryDate = token.expiry_date ? new Date(token.expiry_date) : null;
    // if (!expiryDate || expiryDate <= new Date()) {
    //   console.log('トークンの有効期限が切れています');
    //   return null;
    // }
    const token = JSON.parse(fs.readFileSync(TOKEN_PATH, 'utf-8'));
    
    // トークンをセット
    oAuth2Client.setCredentials(token);
    
    // Google Calendar API サービスを作成
    const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });

    start.setHours(0, 0, 0, 0); // 00:00:00
    end.setHours(23, 59, 59, 999); // 23:59:59
    
    // イベント一覧を取得
    const res = await calendar.events.list({
      calendarId: 'primary',
      timeMin: start.toISOString(),
      timeMax: end.toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
    });
    
    return res.data;
  } catch (err) {
    console.error('Error:', err);
    return null;
  }
}