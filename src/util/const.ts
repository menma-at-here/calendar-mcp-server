import path from 'path';

// TODO: もっといい感じに ROOT_DIR を取得する方法を考える
export const ROOT_DIR = path.join(__dirname, '../..');

export const TOKEN_PATH = path.join(ROOT_DIR, 'token.json');
