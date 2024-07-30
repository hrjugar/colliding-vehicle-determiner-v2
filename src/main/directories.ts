import path from "path";
import webpackPaths from "../../.erb/configs/webpack.paths";
import { app } from "electron";
import fs from "fs";
import fsExtra from "fs-extra";

export const RESOURCES_DIR = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

export const DEFAULT_PROJECTS_DIR =
  process.env.NODE_ENV === 'development' ?
    path.join(webpackPaths.appPath, 'projects') :
    path.join(app.getPath('documents'), 'Colliding Vehicle Determiner', 'Projects');

export const TEMP_DIR =
  process.env.NODE_ENV === 'development' ?
    path.join(webpackPaths.appPath, 'temp') :
    path.join(app.getPath('temp'), app.getName());

export const DB_DIR =
  process.env.NODE_ENV === 'development' ?
    path.join(webpackPaths.appPath, 'db') :
    app.getPath('userData');


export const getAssetPath = (...paths: string[]): string => {
  return path.join(RESOURCES_DIR, ...paths);
};

export const clearTempDir = () => {
  fsExtra.emptyDirSync(TEMP_DIR);
}

export const setupDirectories = () => {
  fs.mkdirSync(DEFAULT_PROJECTS_DIR, { recursive: true });

  if (process.env.NODE_ENV === 'development') {
    fs.mkdirSync(TEMP_DIR, { recursive: true });
  }

  clearTempDir();
}