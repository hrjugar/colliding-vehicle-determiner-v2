import { BrowserWindow, ipcMain } from "electron";
import { db } from "../db";
import { CollisionStatusSettingValue, LayoutSettingValue, OrderSettingValue, Setting, Settings, SortBySettingValue } from "../../types";

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
        ('layout', 'grid')
  `)
  .run();
}

const initSettingsHandlers = () => {
  ipcMain.handle('db-settings-get', () => {
    const settingsArray = db.prepare(`SELECT name, value FROM settings`).all() as Setting[];

    let layoutSetting: LayoutSettingValue = 'grid';
    let sortBySetting: SortBySettingValue = 'date';
    let orderSetting: OrderSettingValue = 'desc';
    let collisionStatusSetting: CollisionStatusSettingValue = 'all';

    for (const setting of settingsArray) {
      if (setting.name === 'layout') {
        layoutSetting = setting.value;
      } else if (setting.name === 'sortBy') {
        sortBySetting = setting.value;
      } else if (setting.name === 'order') {
        orderSetting = setting.value;
      } else if (setting.name === 'collisionStatus') {
        collisionStatusSetting = setting.value;
      }
    }

    let settingsJson: Settings = {
      layout: layoutSetting,
      sortBy: sortBySetting,
      order: orderSetting,
      collisionStatus: collisionStatusSetting,
    };

    return settingsJson;
  });

  ipcMain.handle('db-settings-set', (_, setting: Setting) => {

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