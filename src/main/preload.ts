// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import { Accident, AccidentInput, Setting, Settings } from '../types';
import { CHANNEL_ACCIDENT_CHANGE, CHANNEL_ACCIDENT_DELETE, CHANNEL_ACCIDENTS_ADD_ONE, CHANNEL_ACCIDENTS_DELETE_ONE, CHANNEL_ACCIDENTS_FIND, CHANNEL_ACCIDENTS_GET_ALL, CHANNEL_ACCIDENTS_GET_ONE, CHANNEL_ADD_MODAL_INITIAL_FILE_NAME_GET, CHANNEL_ADD_MODAL_WINDOW_CLOSE, CHANNEL_ADD_MODAL_WINDOW_OPEN, CHANNEL_OS_GET, CHANNEL_PORT_GET, CHANNEL_SETTING_CHANGE, CHANNEL_SETTINGS_GET, CHANNEL_SETTINGS_SET } from './channels';

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
  os: {
    get(): Promise<NodeJS.Platform> {
      return ipcRenderer.invoke(CHANNEL_OS_GET);
    }
  },
  port: {
    get(): Promise<number> {
      return ipcRenderer.invoke(CHANNEL_PORT_GET);
    }
  },
  addModal: {
    async open(filePath: string) {
      ipcRenderer.send(CHANNEL_ADD_MODAL_WINDOW_OPEN, filePath);
    },
    async close() {
      ipcRenderer.send(CHANNEL_ADD_MODAL_WINDOW_CLOSE);
    },
    getInitialFilePath(): Promise<string> {
      return ipcRenderer.invoke(CHANNEL_ADD_MODAL_INITIAL_FILE_NAME_GET);
    }
  },
  db: {
    settings: {
      get(): Promise<Settings> {
        return ipcRenderer.invoke(CHANNEL_SETTINGS_GET);
      },
      set(setting: Setting) {
        return ipcRenderer.invoke(CHANNEL_SETTINGS_SET, setting);
      },
      onChange(callback: (setting: Setting) => void) {
        const listener = (_: IpcRendererEvent, setting: Setting) => callback(setting);
        ipcRenderer.on(CHANNEL_SETTING_CHANGE, listener);

        return () => {
          ipcRenderer.removeListener(CHANNEL_SETTING_CHANGE, listener);
        }
      },
    },
    accidents: {
      getAll(): Promise<Accident[]> {
        return ipcRenderer.invoke(CHANNEL_ACCIDENTS_GET_ALL); 
      },
      getOne(id: number): Promise<Accident> {
        return ipcRenderer.invoke(CHANNEL_ACCIDENTS_GET_ONE, id);
      },
      find(): Promise<string | null> {
        return ipcRenderer.invoke(CHANNEL_ACCIDENTS_FIND);
      },
      add(accidentInput: AccidentInput) {
        return ipcRenderer.invoke(CHANNEL_ACCIDENTS_ADD_ONE, accidentInput);
      },
      deleteOne(id: number) {
        return ipcRenderer.invoke(CHANNEL_ACCIDENTS_DELETE_ONE, id);
      },
      onChange(callback: (accident: Accident) => void) {
        const listener = (_: IpcRendererEvent, accident: Accident) => callback(accident);
        ipcRenderer.on(CHANNEL_ACCIDENT_CHANGE, listener);

        return () => {
          ipcRenderer.removeListener(CHANNEL_ACCIDENT_CHANGE, listener);
        }
      },
      onDelete(callback: (id: number) => void) {
        const listener = (_: IpcRendererEvent, id: number) => callback(id);
        ipcRenderer.on(CHANNEL_ACCIDENT_DELETE, listener);

        return () => {
          ipcRenderer.removeListener(CHANNEL_ACCIDENT_DELETE, listener);
        }
      }
    }
  }
};

contextBridge.exposeInMainWorld('electron', electronHandler);

export type ElectronHandler = typeof electronHandler;
