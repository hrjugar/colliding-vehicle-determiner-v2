import path from "path";
import webpackPaths from "../../.erb/configs/webpack.paths";
import { app } from "electron";
import fs from "fs";

export const defaultProjectsDir =
  process.env.NODE_ENV === 'development' ?
    path.join(webpackPaths.appPath, 'projects') :
    path.join(app.getPath('documents'), 'Colliding Vehicle Determiner', 'Projects');

export const tempDir =
  process.env.NODE_ENV === 'development' ?
    path.join(webpackPaths.appPath, 'temp') :
    path.join(app.getPath('documents'), 'Colliding Vehicle Determiner', 'temp');

export const dbDir =
  process.env.NODE_ENV === 'development' ?
    path.join(webpackPaths.appPath, 'db') :
    app.getPath('userData');

    
export const setupDirectories = () => {
  fs.mkdirSync(defaultProjectsDir, { recursive: true });
  fs.mkdirSync(tempDir, { recursive: true });
}