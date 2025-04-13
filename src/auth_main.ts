// calendar.ts
import fs from 'fs';
import path from 'path';
import { google } from 'googleapis';
import { authorize } from './util/authorize'; // 認証用の関数をインポート
import { OAuth2Client } from 'google-auth-library';

/**
 * 今週の開始と終了日時を RFC3339 (ISO8601) 形式で返す
 */
function getCurrentWeekRange(): { start: string; end: string } {
  const now = new Date();
  const dayOfWeek = (now.getDay() + 6) % 7; // 月曜=0, ... 日曜=6

  const monday = new Date(now);
  monday.setDate(now.getDate() - dayOfWeek);
  monday.setHours(0, 0, 0, 0);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);

  return { start: monday.toISOString(), end: sunday.toISOString() };
}

/**
 * メイン関数
 */
async function main() {
  try {
    // 1. OAuth2Client を用意
    const auth = await authorize();

    // 2. Google Calendar API サービスを作成
    const calendar = google.calendar({ version: 'v3', auth });

    // 3. 今週の開始・終了日時 (UTC 形式) を取得
    const { start, end } = getCurrentWeekRange();

    // 4. イベント一覧を取得
    const res = await calendar.events.list({
      calendarId: 'primary', // メインカレンダー
      timeMin: start,
      timeMax: end,
      singleEvents: true,
      orderBy: 'startTime',
    });

    console.log(res);

    // const events = res.data.items || [];
    // if (events.length === 0) {
    //   console.log('今週の予定はありません。');
    //   return;
    // }

    // console.log('今週の予定:');
    // for (const event of events) {
    //   const startTime = event.start?.dateTime || event.start?.date;
    //   const endTime = event.end?.dateTime || event.end?.date;
    //   console.log(`- ${event.summary || '無題'}: ${startTime} ~ ${endTime}`);
    // }
  } catch (err) {
    console.error('Error:', err);
  }
}

// 実行
main();
