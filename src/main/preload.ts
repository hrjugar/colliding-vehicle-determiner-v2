// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import { Setting, Settings } from './types';

// export type Channels = 'ipc-example';

const electronHandler = {
  // ipcRenderer: {
  //   sendMessage(channel: Channels, ...args: unknown[]) {
  //     ipcRenderer.send(channel, ...args);
  //   },
  //   on(channel: Channels, func: (...args: unknown[]) => void) {
  //     const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
  //       func(...args);
  //     ipcRenderer.on(channel, subscription);

  //     return () => {
  //       ipcRenderer.removeListener(channel, subscription);
  //     };
  //   },
  //   once(channel: Channels, func: (...args: unknown[]) => void) {
  //     ipcRenderer.once(channel, (_event, ...args) => func(...args));
  //   },
  // },
  db: {
    getSettings(): Promise<Settings> {
      return ipcRenderer.invoke('db-settings-get');
    },
    setSetting(setting: Setting) {
      return ipcRenderer.invoke('db-settings-set', setting.name, setting.value);
    },
    onSettingChange(callback: (setting: Setting) => void) {
      const listener = (_: IpcRendererEvent, setting: Setting) => callback(setting);
      ipcRenderer.on('setting-change', listener);

      return () => {
        ipcRenderer.removeListener('setting-change', listener);
      }
    }
  }
};

contextBridge.exposeInMainWorld('electron', electronHandler);

export type ElectronHandler = typeof electronHandler;
