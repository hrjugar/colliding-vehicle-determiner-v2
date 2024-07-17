// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import { Accident, AccidentInput, Setting, Settings } from '../types';

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
    settings: {
      get(): Promise<Settings> {
        return ipcRenderer.invoke('db-settings-get');
      },
      set(setting: Setting) {
        return ipcRenderer.invoke('db-settings-set', setting);
      },
      onChange(callback: (setting: Setting) => void) {
        const listener = (_: IpcRendererEvent, setting: Setting) => callback(setting);
        ipcRenderer.on('setting-change', listener);

        return () => {
          ipcRenderer.removeListener('setting-change', listener);
        }
      },
    },
    accidents: {
      getAll(): Promise<Accident[]> {
        return ipcRenderer.invoke('db-accidents-get-all'); 
      },
      getOne(id: number): Promise<Accident> {
        return ipcRenderer.invoke('db-accidents-get-one', id);
      },
      add(accidentInput: AccidentInput) {
        return ipcRenderer.invoke('db-accidents-add-one', accidentInput);
      },
      deleteOne(id: number) {
        return ipcRenderer.invoke('db-accidents-delete-one', id);
      },
      onChange(callback: (accident: Accident) => void) {
        const listener = (_: IpcRendererEvent, accident: Accident) => callback(accident);
        ipcRenderer.on('accident-change', listener);

        return () => {
          ipcRenderer.removeListener('accident-change', listener);
        }
      },
      onDelete(callback: (id: number) => void) {
        const listener = (_: IpcRendererEvent, id: number) => callback(id);
        ipcRenderer.on('accident-delete', listener);

        return () => {
          ipcRenderer.removeListener('accident-delete', listener);
        }
      }
    }
  }
};

contextBridge.exposeInMainWorld('electron', electronHandler);

export type ElectronHandler = typeof electronHandler;
