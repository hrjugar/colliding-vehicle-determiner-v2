import fs from "fs";
import path from "path";
import Database from "better-sqlite3";
import { DB_DIR } from "./directories";

const dbName = 'cvd.sqlite3';

if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

const dbPath = path.join(DB_DIR, dbName);
export const db = new Database(dbPath);