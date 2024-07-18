/* eslint global-require: off, no-console: off, promise/always-return: off */

import os from 'os';
import path from 'path';
import { app, BrowserWindow, ipcMain, net, protocol, shell } from 'electron';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import { clearTempDir, setupDirectories } from './directories';
import { setupCollections } from './collections';
import { db } from './db';
import { getProjectsDir } from './collections/settings';

let mainWindow: BrowserWindow | null = null;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const createWindow = async () => {
  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    minWidth: 800,
    ...(process.env.NODE_ENV === 'development' ? { width: 1500 } : {}),
    minHeight: 600,
    icon: getAssetPath('icon.png'),
    titleBarStyle: 'hidden',
    trafficLightPosition: {
      x: 24,
      y: 20,
    },
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });
};

ipcMain.handle('os-get', () => os.platform());

app.on('window-all-closed', () => {
  db.close();
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  // NOTE: This will not work when app is closed through Windows shut down or log out.
  // TODO; Find a way to clear temp dir on Windows shut down or log out.
  clearTempDir();
});

app
  .whenReady()
  .then(() => {
    setupDirectories();
    setupCollections();
    createWindow();

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
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
