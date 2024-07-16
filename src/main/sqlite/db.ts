import fs from "fs";
import path from "path";
import webpackPaths from "../../../.erb/configs/webpack.paths";
import { app } from "electron";
import Database from "better-sqlite3";

const dbName = 'cvd.sqlite3';

let dbPath;
if (process.env.NODE_ENV === 'production') {
  dbPath = path.join(app.getPath('userData'), dbName);
} else {
  const dbDevDir = path.join(webpackPaths.appPath, 'db');
  if (!fs.existsSync(dbDevDir)) {
    fs.mkdirSync(dbDevDir);
  }
  dbPath = path.join(dbDevDir, dbName);
}

export const db = new Database(dbPath);