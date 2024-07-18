import { app, BrowserWindow, dialog, ipcMain, nativeImage } from "electron";
import { db } from "../db";
import { Accident, AccidentInput, Setting } from "../../types";
import { formatDateTimeToText } from "../util";
import fs from "fs";
import fsExtra from "fs-extra";
import { tempDir } from "../directories";
import path from "path";
import { getProjectsDir } from "./settings";

const initAccidentsTable = () => {
  db
  .prepare(`
    CREATE TABLE IF NOT EXISTS 
      accidents (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        collidingVehicle INTEGER CHECK(collidingVehicle >= 0 AND collidingVehicle <= 2),
        dateCreated TEXT NOT NULL
      )
  `)
  .run();
}

const initAccidentsHandlers = () => {
  ipcMain.handle('accidents-get-all', () => {
    return db.prepare(`SELECT * FROM accidents`).all() as Accident[];
  });

  ipcMain.handle('accidents-get-one', (_, id: number) => {
    return db.prepare(`SELECT * FROM accidents WHERE id = ?`).get(id) as Accident;
  });

  ipcMain.handle('accidents-find', async (_) => {
    const { canceled, filePaths } = await dialog.showOpenDialog({
      filters: [
        { name: 'MP4 Files', extensions: ['mp4'] }
      ]
    });

    if (canceled) {
      return null;
    }

    const [ filePath ] = filePaths;
    const fileIcon = await nativeImage.createThumbnailFromPath(filePath, { width: 272, height: 272 });
    const thumbnail = fileIcon.toJPEG(100);
    fs.writeFileSync(path.join(tempDir, 'thumbnail.jpg'), thumbnail);

    return filePath;
  })

  ipcMain.handle('accidents-add-one', (_, accidentInput: AccidentInput) => {
    const currentDateTimeText = formatDateTimeToText(new Date());

    const statement = db
      .prepare(`INSERT INTO accidents (name, collidingVehicle, dateCreated) VALUES (?, ?, ?)`)
      .run(accidentInput.name, accidentInput.collidingVehicle, currentDateTimeText);

    const newAccident = db
      .prepare(`SELECT * FROM accidents WHERE id = ?`)
      .get(statement.lastInsertRowid) as Accident;

    const projectsDir = getProjectsDir();
    const projectDir = path.join(projectsDir, newAccident.id.toString());

    fs.mkdirSync(projectDir);
    fsExtra.moveSync(
      path.join(tempDir, 'thumbnail.jpg'), 
      path.join(projectDir, 'thumbnail.jpg')
    );

    BrowserWindow.getAllWindows().forEach((win) => {
      win.webContents.send('accident-change', newAccident);
    })
  });

  ipcMain.handle('accidents-delete-one', (_, id: number) => {
    db.prepare(`DELETE FROM accidents WHERE id = ?`).run(id);

    const projectsDir = getProjectsDir();
    const projectDir = path.join(projectsDir, id.toString());
    fs.rmdirSync(projectDir, { recursive: true });

    BrowserWindow.getAllWindows().forEach((win) => {
      win.webContents.send('accident-delete', id);
    })
  });
}

export const setupAccidents = () => {
  initAccidentsTable();
  initAccidentsHandlers();
};