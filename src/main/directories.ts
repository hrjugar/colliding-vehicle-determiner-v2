import path from "path";
import webpackPaths from "../../.erb/configs/webpack.paths";
import { app } from "electron";
import fs from "fs";
import fsExtra from "fs-extra";

export const defaultProjectsDir =
  process.env.NODE_ENV === 'development' ?
    path.join(webpackPaths.appPath, 'projects') :
    path.join(app.getPath('documents'), 'Colliding Vehicle Determiner', 'Projects');

export const tempDir =
  process.env.NODE_ENV === 'development' ?
    path.join(webpackPaths.appPath, 'temp') :
    app.getPath('temp');

export const dbDir =
  process.env.NODE_ENV === 'development' ?
    path.join(webpackPaths.appPath, 'db') :
    app.getPath('userData');


export const clearTempDir = () => {
  fsExtra.emptyDirSync(tempDir);
}

export const setupDirectories = () => {
  fs.mkdirSync(defaultProjectsDir, { recursive: true });

  if (process.env.NODE_ENV === 'development') {
    fs.mkdirSync(tempDir, { recursive: true });
  }

  clearTempDir();
}