import fs from 'fs';
import path from 'path';
import { rootDir } from './const';
import { google } from "googleapis";

const credentialPath = path.join(rootDir, 'credentials.json');
  const credentials = JSON.parse(fs.readFileSync(credentialPath, 'utf-8'));

  const { client_id, client_secret, redirect_uris } = credentials.installed || credentials.web;
export const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);