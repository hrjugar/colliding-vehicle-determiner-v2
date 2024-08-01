import { create } from "zustand";

interface OsStore {
  os: NodeJS.Platform;
  port: number;
  initServerConfig: () => Promise<void>;
}

export const useServerConfigStore = create<OsStore>((set) => ({
  os: "win32",
  port: 0,

  initServerConfig: async () => {
    const os = await window.electron.os.get();
    const port = await window.electron.port.get();

    set({ os, port });
  }
}));