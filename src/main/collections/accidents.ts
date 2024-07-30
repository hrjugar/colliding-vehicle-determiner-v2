import { app, BrowserWindow, dialog, ipcMain, nativeImage } from "electron";
import { db } from "../db";
import { Accident, AccidentInput, Setting } from "../../types";
import { formatDateTimeToText } from "../util";
import fs from "fs";
import fsExtra from "fs-extra";
import { TEMP_DIR } from "../directories";
import path from "path";
import { getProjectsDir } from "./settings";
import { CHANNEL_ACCIDENT_DELETE, CHANNEL_ACCIDENTS_ADD_ONE, CHANNEL_ACCIDENTS_DELETE_ONE, CHANNEL_ACCIDENTS_FIND, CHANNEL_ACCIDENTS_GET_ALL, CHANNEL_ACCIDENTS_GET_ONE } from "../channels";

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
  ipcMain.handle(CHANNEL_ACCIDENTS_GET_ALL, () => {
    return db.prepare(`SELECT * FROM accidents`).all() as Accident[];
  });

  ipcMain.handle(CHANNEL_ACCIDENTS_GET_ONE, (_, id: number) => {
    return db.prepare(`SELECT * FROM accidents WHERE id = ?`).get(id) as Accident;
  });

  ipcMain.handle(CHANNEL_ACCIDENTS_FIND, async (_) => {
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
    fs.writeFileSync(path.join(TEMP_DIR, 'thumbnail.jpg'), thumbnail);

    return filePath;
  })

  ipcMain.handle(CHANNEL_ACCIDENTS_ADD_ONE, (_, accidentInput: AccidentInput) => {
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
      path.join(TEMP_DIR, 'thumbnail.jpg'), 
      path.join(projectDir, 'thumbnail.jpg')
    );

    BrowserWindow.getAllWindows().forEach((win) => {
      win.webContents.send('accident-change', newAccident);
    })
  });

  ipcMain.handle(CHANNEL_ACCIDENTS_DELETE_ONE, (_, id: number) => {
    db.prepare(`DELETE FROM accidents WHERE id = ?`).run(id);

    const projectsDir = getProjectsDir();
    const projectDir = path.join(projectsDir, id.toString());
    fs.rmdirSync(projectDir, { recursive: true });

    BrowserWindow.getAllWindows().forEach((win) => {
      win.webContents.send(CHANNEL_ACCIDENT_DELETE, id);
    })
  });
}

export const setupAccidents = () => {
  initAccidentsTable();
  initAccidentsHandlers();
};