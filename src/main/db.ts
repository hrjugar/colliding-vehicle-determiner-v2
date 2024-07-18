import fs from "fs";
import path from "path";
import Database from "better-sqlite3";
import { dbDir } from "./directories";

const dbName = 'cvd.sqlite3';

fs.mkdirSync(dbDir, { recursive: true });
const dbPath = path.join(dbDir, dbName);

export const db = new Database(dbPath);