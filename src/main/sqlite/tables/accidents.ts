import { BrowserWindow, ipcMain } from "electron";
import { db } from "../db";
import { Accident, AccidentInput } from "../../../types";
import { formatDateTimeToText } from "../../util";

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

  ipcMain.handle('accidents-add-one', (_, accidentInput: AccidentInput) => {
    const currentDateTimeText = formatDateTimeToText(new Date());

    const statement = db
      .prepare(`INSERT INTO accidents (name, collidingVehicle, dateCreated) VALUES (?, ?, ?)`)
      .run(accidentInput.name, accidentInput.collidingVehicle, currentDateTimeText);

    const newAccident = db
      .prepare(`SELECT * FROM accidents WHERE id = ?`)
      .get(statement.lastInsertRowid) as Accident;

    BrowserWindow.getAllWindows().forEach((win) => {
      win.webContents.send('accident-change', newAccident);
    })
  });

  ipcMain.handle('accidents-delete-one', (_, id: number) => {
    db.prepare(`DELETE FROM accidents WHERE id = ?`).run(id);

    BrowserWindow.getAllWindows().forEach((win) => {
      win.webContents.send('accident-delete', id);
    })
  });
}

export const setupAccidents = () => {
  initAccidentsTable();
  initAccidentsHandlers();
};