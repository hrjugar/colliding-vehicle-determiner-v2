import { create } from "zustand";

interface OsStore {
  os: NodeJS.Platform;
  initOs: () => Promise<void>;
}

export const useOsStore = create<OsStore>((set) => ({
  os: "win32",
  initOs: async () => {
    const os = await window.electron.os.get();
    set({ os });
  }
}));