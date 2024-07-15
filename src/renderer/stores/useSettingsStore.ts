import { create } from "zustand";
import { Setting } from "../../main/types";

interface SettingsStore {
  settings: Record<string, string>;
  initSettings: () => Promise<void>;
  updateSetting: (setting: Setting) => Promise<void>;
}

export const useSettingsStore = create<SettingsStore>((set) => ({
  settings: {},

  initSettings: async () => {
    const settings = await window.electron.db.getSettings();
    set({ settings });

    window.electron.db.onSettingChange((setting) => {
      set((state) => ({
        settings: { ...state.settings, [setting.name]: setting.value }
      }))
    })
  },

  updateSetting: async (setting: Setting) => {
    await window.electron.db.setSetting(setting);
  }
}));