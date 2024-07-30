import { BrowserWindow, ipcMain } from "electron";
import { db } from "../db";
import { CollisionStatusSettingValue, LayoutSettingValue, OrderSettingValue, ProjectsDirSettingValue, Setting, Settings, SortBySettingValue } from "../../types";
import { DEFAULT_PROJECTS_DIR } from "../directories";

const initSettingsTable = () => {
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
        ('sortBy', 'date'),
        ('order', 'desc'),
        ('collisionStatus', 'all'),
        ('layout', 'grid'),
        ('projectsDir', '${DEFAULT_PROJECTS_DIR}')
  `)
  .run();
}

const initSettingsHandlers = () => {
  ipcMain.handle('settings-get', () => {
    const settingsArray = db.prepare(`SELECT name, value FROM settings`).all() as Setting[];

    let layout: LayoutSettingValue = 'grid';
    let sortBy: SortBySettingValue = 'date';
    let order: OrderSettingValue = 'desc';
    let collisionStatus: CollisionStatusSettingValue = 'all';
    let projectsDir: ProjectsDirSettingValue = DEFAULT_PROJECTS_DIR;

    for (const setting of settingsArray) {
      if (setting.name === 'layout') {
        layout = setting.value;
      } else if (setting.name === 'sortBy') {
        sortBy = setting.value;
      } else if (setting.name === 'order') {
        order = setting.value;
      } else if (setting.name === 'collisionStatus') {
        collisionStatus = setting.value;
      } else if (setting.name === 'projectsDir') {
        projectsDir = setting.value;
      }
    }

    let settingsJson: Settings = {
      layout,
      sortBy,
      order,
      collisionStatus,
      projectsDir,
    };

    return settingsJson;
  });

  ipcMain.handle('settings-set', (_, setting: Setting) => {
    db
      .prepare(`INSERT OR REPLACE INTO settings (name, value) VALUES (?, ?)`)
      .run(setting.name, setting.value);

    BrowserWindow.getAllWindows().forEach((win) => {
      win.webContents.send('setting-change', setting);
    });
  });
}

export const setupSettings = () => {
  initSettingsTable();
  initSettingsHandlers();
}

export const getProjectsDir = () => {
  return (
    db.prepare(`SELECT * FROM settings WHERE name = 'projectsDir'`).get() as Setting
  ).value as string;
}