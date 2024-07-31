import { create } from "zustand";
import { Time } from "../../types";

type AddModalStep = 1 | 2 | 3;

interface AddModalStore {
  step: AddModalStep;
  fileName: string;
  accidentName: string;
  startTime: Time;
  endTime: Time;
  originalEndTime: Time;
  initAddModal: () => Promise<void>;
  goToPreviousStep: () => void;
  goToNextStep: () => void;
  setFileName: (fileName: string) => void;
  setAccidentName: (accidentName: string) => void;
  setStartTime: (startTime: Time) => void;
  setEndTime: (endTime: Time) => void;
  setOriginalEndTime: (originalEndTime: Time) => void;
}

export const useAddModalStore = create<AddModalStore>((set) => ({
  step: 1,
  fileName: '',
  accidentName: '',
  startTime: { hours: 0, minutes: 0, seconds: 0, milliseconds: 0 },
  endTime: { hours: 0, minutes: 0, seconds: 0, milliseconds: 0 },
  originalEndTime: { hours: 0, minutes: 0, seconds: 0, milliseconds: 0 },

  async initAddModal() {
    set({ fileName: await window.electron.addModal.getInitialFileName() });
  },

  goToPreviousStep() { 
    set((state) => ({
      step: (state.step > 1 ? state.step - 1 : state.step) as AddModalStep
    }));
  },

  goToNextStep() { 
    set((state) => ({
      step: (state.step < 3 ? state.step + 1 : state.step) as AddModalStep
    }));
  },
  
  setFileName(fileName) { 
    set({ fileName }) 
  },

  setAccidentName(accidentName) { 
    set({ accidentName }) 
  },

  setStartTime(startTime) { 
    set({ startTime }) 
  },

  setEndTime(endTime) { 
    set({ endTime }) 
  },

  setOriginalEndTime(originalEndTime) { 
    set({ originalEndTime }) 
  }
}));