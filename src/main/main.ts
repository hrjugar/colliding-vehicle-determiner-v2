/* eslint global-require: off, no-console: off, promise/always-return: off */

import os from 'os';
import path from 'path';
import fs from 'fs';
import { app, BrowserWindow, ipcMain, net, protocol, shell } from 'electron';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import { clearTempDir, getAssetPath, setupDirectories } from './directories';
import { setupCollections } from './collections';
import { db } from './db';
import { getProjectsDir } from './collections/settings';
import { CHANNEL_ADD_MODAL_INITIAL_FILE_NAME_GET, CHANNEL_ADD_MODAL_WINDOW_CLOSE, CHANNEL_ADD_MODAL_WINDOW_OPEN, CHANNEL_OS_GET } from './channels';
import { Readable } from 'stream';

let mainWindow: BrowserWindow | null = null;
let addModalWindow: BrowserWindow | null = null;
let addModalInitialFileName = '';

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

if (process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true') {
  require('electron-debug')();
}

protocol.registerSchemesAsPrivileged([
  {
    scheme: 'video',
    privileges: {
      standard: true,
      secure: true,
      supportFetchAPI: true,
      corsEnabled: true,
      stream: true,
      bypassCSP: true,
    },
  }
]);

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

const createAddModalWindow = async () => {
  addModalWindow = new BrowserWindow({
    parent: mainWindow!,
    modal: true,
    show: false,
    width: 1200,
    height: 800,
    minWidth: 1200,
    minHeight: 800,
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

  addModalWindow.loadURL(resolveHtmlPath('index.html', "add-modal"));

  addModalWindow.on('ready-to-show', () => {
    if (!addModalWindow) {
      throw new Error('"secondaryWindow" is not defined');
    }
    
    addModalWindow.show();
  });

  addModalWindow.on('closed', () => {
    addModalWindow = null;
  });

  addModalWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });
};

ipcMain.handle(CHANNEL_OS_GET, () => os.platform());

ipcMain.on(CHANNEL_ADD_MODAL_WINDOW_OPEN, (_, fileName) => {
  if (!addModalWindow) {
    addModalInitialFileName = fileName;
    createAddModalWindow();
  }
});

ipcMain.on(CHANNEL_ADD_MODAL_WINDOW_CLOSE, () => {
  if (addModalWindow) {
    addModalInitialFileName = '';
    addModalWindow.close();
  }
});

ipcMain.handle(CHANNEL_ADD_MODAL_INITIAL_FILE_NAME_GET, () => {
  return addModalInitialFileName;
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

  if (addModalWindow) {
    addModalWindow.close();
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

    protocol.handle('video', async (request) => {
      // TODO: Remove leading slash for non-MacOS platforms
      const videoPath = '/' + decodeURIComponent(request.url.replace('video://', ''));

      if (!fs.existsSync(videoPath)) {
        return new Response('File Not Found', { status: 404 });
      }

      const stat = fs.statSync(videoPath);
      const fileSize = stat.size;
      const range = request.headers.get('Range');

      if (range) {
        const parts = range.replace(/bytes=/, '').split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
        const chunkSize = (end - start) + 1;
        const file = fs.createReadStream(videoPath, { start, end });
        const headers = {
          'Content-Range': `bytes ${start}-${end}/${fileSize}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': chunkSize.toString(),
          'Content-Type': 'video/mp4',
        };

        return new Response(Readable.toWeb(file) as BodyInit, { status: 206, headers });
      } else {
        const headers = {
          'Content-Length': fileSize.toString(),
          'Content-Type': 'video/mp4',
        };

        const file = fs.createReadStream(videoPath);
        return new Response(Readable.toWeb(file) as BodyInit, { status: 200, headers });
      }
    })

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
