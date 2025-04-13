import { google } from "googleapis";
import fs from "fs";
import { TOKEN_PATH } from "util/const";
import { oAuth2Client } from "util/oAuthClient";

export async function getCalendarWithToken(start: Date, end: Date): Promise<any> {
  try {
    
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