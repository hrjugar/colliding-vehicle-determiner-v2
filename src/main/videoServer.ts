import express from 'express';
import fs from 'fs';
import path from 'path';
import { AddressInfo } from 'net';
import { ipcMain } from 'electron';
import { CHANNEL_PORT_GET } from './channels';
import { Server } from 'http';

let host = '127.0.0.1';

const app = express();
let server: Server;

app.get('/video', (req, res) => {
  const source = req.query.source;
  let originalFilePath;

  switch (source) {
    default:
    case 'local':
      originalFilePath = req.query.path;
      break;
  }

  if (!originalFilePath) {
    res.status(400).send('Missing video path');
    return;
  }

  const range = req.headers.range;
  if (!range) {
    res.status(400).send('Requires Range header');
    return;
  }

  const resolvedFilePath = path.resolve(originalFilePath as string);

  const stat = fs.statSync(resolvedFilePath);
  const fileSize = stat.size;
  const chunkSize = 10 ** 6;
  const start = Number(range.replace(/\D/g, ''));
  const end = Math.min(start + chunkSize, fileSize - 1);

  const contentLength = end - start + 1;
  const headers = {
    'Content-Range': `bytes ${start}-${end}/${fileSize}`,
    'Accept-Ranges': 'bytes',
    'Content-Length': contentLength,
    'Content-Type': 'video/mp4',
  };

  res.writeHead(206, headers);

  const videoStream = fs.createReadStream(resolvedFilePath, { start, end });
  videoStream.pipe(res);
});

export const setupVideoServer = () => {
  server = app.listen(0, host, () => {
    let address = server.address() as AddressInfo;
    console.log(`Video server listening at http://${address.address}:${address.port}`);
  });
  
  ipcMain.handle(CHANNEL_PORT_GET, () => {
    return (server.address() as AddressInfo).port;
  });
};

export const stopVideoServer = () => {
  if (server) {
    console.log("Server closing");
    server.close();
  }
}