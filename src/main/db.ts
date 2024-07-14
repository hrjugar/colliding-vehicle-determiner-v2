import fs from "fs";
import path from "path";
import webpackPaths from "../../.erb/configs/webpack.paths";
import { app, BrowserWindow, ipcMain } from "electron";
import Database from "better-sqlite3";
import { Setting, Settings } from "./types";

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

const initDatabase = () => {
  db
    .prepare(`
      CREATE TABLE IF NOT EXISTS 
        accidents (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL
        )
    `)
    .run();

  const initSettings = db.transaction(() => {
    db.prepare(`
      CREATE TABLE IF NOT EXISTS
        settings (
          name TEXT PRIMARY KEY,
          value TEXT
        ) 
    `).run();

    db.prepare(`
      INSERT OR IGNORE INTO 
        settings (
          name, 
          value
        )
        VALUES 
          ('sortBy', 'name'),
          ('order', 'asc'),
          ('layout', 'list')
    `)
    .run();
  });

  initSettings();
};

const initDatabaseHandlers = () => {
  ipcMain.handle('db-settings-get', () => {
    const settingsArray = db.prepare(`SELECT name, value FROM settings`).all() as Setting[];

    const settingsJson: Settings = settingsArray.reduce<Settings>((acc, setting) => {
      acc[setting.name] = setting.value;
      return acc;
    }, {});

    return settingsJson;
  });

  ipcMain.on('db-settings-set', (_, setting: Setting) => {
    db
      .prepare(`INSERT OR REPLACE INTO settings (name, value) VALUES (?, ?)`)
      .run(setting.name, setting.value);

      BrowserWindow.getAllWindows().forEach((win) => {
        win.webContents.send('setting-change', setting);
      });
  });
};

export const setupDatabase = () => {
  initDatabase();
  initDatabaseHandlers();
}