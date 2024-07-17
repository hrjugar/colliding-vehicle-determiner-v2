import { create } from "zustand";
import { Setting, Settings } from "../../main/types";
import { produce } from "immer";

interface SettingsStore {
  settings: Settings;
  initSettings: () => Promise<void>;
  updateSetting: (setting: Setting) => Promise<void>;
}

export const useSettingsStore = create<SettingsStore>((set) => ({
  settings: {
    layout: 'grid',
    sortBy: 'date',
    order: 'desc',
    collisionStatus: 'all'
  },

  initSettings: async () => {
    const settings = await window.electron.db.settings.get();
    set({ settings });

    window.electron.db.settings.onChange((setting) => {
      set(
        produce((state) => {
          state.settings[setting.name] = setting.value;
        })
      )
    });
  },

  updateSetting: async (setting: Setting) => {
    await window.electron.db.settings.set(setting);
  }
}));