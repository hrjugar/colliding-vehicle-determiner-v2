import { app, BrowserWindow, ipcMain, shell } from "electron";
import { getAssetPath } from "./directories";
import path from "path";
import { resolveHtmlPath } from "./util";
import MenuBuilder from "./menu";
import { CHANNEL_ADD_MODAL_WINDOW_OPEN, CHANNEL_ADD_MODAL_WINDOW_CLOSE, CHANNEL_ADD_MODAL_INITIAL_FILE_NAME_GET } from "./channels";


export let mainWindow: BrowserWindow | null;

let addModalWindow: BrowserWindow | null;
let addModalInitialFilePath = '';

export async function createMainWindow() {
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

async function createAddModalWindow() {
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

export function setUpWindows() {
  createMainWindow();

  ipcMain.on(CHANNEL_ADD_MODAL_WINDOW_OPEN, (_, filePath) => {
    if (!addModalWindow) {
      addModalInitialFilePath = filePath;
      createAddModalWindow();
    }
  });
  
  ipcMain.on(CHANNEL_ADD_MODAL_WINDOW_CLOSE, () => {
    if (addModalWindow) {
      addModalInitialFilePath = '';
      addModalWindow.close();
    }
  });
  
  ipcMain.handle(CHANNEL_ADD_MODAL_INITIAL_FILE_NAME_GET, () => {
    return addModalInitialFilePath;
  });
}

export function closeWindows() {
  if (mainWindow) {
    mainWindow.close();
  }

  if (addModalWindow) {
    addModalWindow.close();
  }
}