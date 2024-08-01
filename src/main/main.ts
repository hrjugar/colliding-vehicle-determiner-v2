/* eslint global-require: off, no-console: off, promise/always-return: off */

import os from 'os';
import path from 'path';
import { app, ipcMain, net, protocol } from 'electron';
import { clearTempDir, setupDirectories } from './directories';
import { setupCollections } from './collections';
import { db } from './db';
import { getProjectsDir } from './collections/settings';
import { CHANNEL_OS_GET } from './channels';
import { setupVideoServer, stopVideoServer } from './videoServer';
import { closeWindows, createMainWindow, mainWindow, setUpWindows } from './windows';

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

if (process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true') {
  require('electron-debug')();
}

ipcMain.handle(CHANNEL_OS_GET, () => os.platform());

app.on('window-all-closed', () => {
  stopVideoServer();
  db.close();
  app.quit();
});

app.on('before-quit', () => {
  closeWindows();

  // NOTE: This will not work when app is closed through Windows shut down or log out.
  // TODO; Find a way to clear temp dir on Windows shut down or log out.
  clearTempDir();
});

app
  .whenReady()
  .then(() => {
    setupDirectories();
    setupVideoServer();
    setupCollections();
    setUpWindows();

    protocol.handle('mediahandler', async (request) => {
      const url = request.url.split('//');
      const handlerType = url[1];
      const handlerValues = url.slice(2);

      let src;
      switch (handlerType) {
        case 'thumbnail':
          const [id] = handlerValues;
          const projectsDir = getProjectsDir();
          src = path.join(projectsDir, id, 'thumbnail.jpg');
          break;
        default:
          src = '';
      }

      return net.fetch(`file://${src}`);
    });

    app.on('activate', () => {
      if (mainWindow === null) createMainWindow();
    });
  })
  .catch(console.log);
