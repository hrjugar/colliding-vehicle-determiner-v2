/* eslint global-require: off, no-console: off, promise/always-return: off */

import os from 'os';
import path from 'path';
import { app, BrowserWindow, ipcMain, net, protocol, shell } from 'electron';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import { clearTempDir, getAssetPath, setupDirectories } from './directories';
import { setupCollections } from './collections';
import { db } from './db';
import { getProjectsDir } from './collections/settings';

let mainWindow: BrowserWindow | null = null;
let modalWindow: BrowserWindow | null = null;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

if (process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true') {
  require('electron-debug')();
}

const createMainWindow = async () => {
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

  mainWindow.loadURL(resolveHtmlPath('index.html', 'main'));

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

const createModalWindow = async () => {
  modalWindow = new BrowserWindow({
    parent: mainWindow!,
    modal: true,
    show: false,
    minWidth: 800,
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

  modalWindow.loadURL(resolveHtmlPath('index.html', "modal"));

  modalWindow.on('ready-to-show', () => {
    if (!modalWindow) {
      throw new Error('"secondaryWindow" is not defined');
    }

    modalWindow.show();
  });

  modalWindow.on('closed', () => {
    modalWindow = null;
  });

  modalWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });
};


ipcMain.handle('os-get', () => os.platform());

ipcMain.on('modal-window-open', () => {
  console.log("hello world");
  if (!modalWindow) {
    createModalWindow();
  }
});

ipcMain.on('modal-window-close', () => {
  if (modalWindow) {
    modalWindow.close();
  }
});

app.on('window-all-closed', () => {
  db.close();
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  if (mainWindow) {
    mainWindow.close();
  }

  if (modalWindow) {
    modalWindow.close();
  }

  // NOTE: This will not work when app is closed through Windows shut down or log out.
  // TODO; Find a way to clear temp dir on Windows shut down or log out.
  clearTempDir();
});

app
  .whenReady()
  .then(() => {
    setupDirectories();
    setupCollections();
    createMainWindow();

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
