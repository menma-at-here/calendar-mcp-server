import fs from 'fs';
import path from 'path';
import { ROOT_DIR } from './const';
import { google } from "googleapis";

const CREDENTIAL_PATH = path.join(ROOT_DIR, 'credentials.json');
const credentials = JSON.parse(fs.readFileSync(CREDENTIAL_PATH, 'utf-8'));

const { client_id, client_secret, redirect_uris } = credentials.installed || credentials.web;
export const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);