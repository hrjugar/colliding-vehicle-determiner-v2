import { createRef, RefObject } from "react";
import { create } from "zustand";

type AddModalStep = 1 | 2 | 3;

interface AddModalStore {
  step: AddModalStep;
  fileName: string;
  accidentName: string;
  startTime: number;
  endTime: number;
  videoRef: RefObject<HTMLVideoElement>;
  initAddModal: () => Promise<void>;
  initTime: (durationInSeconds: number) => void;
  goToPreviousStep: () => void;
  goToNextStep: () => void;
  setFileName: (fileName: string) => void;
  setAccidentName: (accidentName: string) => void;
  setStartTime: (startTime: number) => void;
  setEndTime: (endTime: number) => void;
}

export const useAddModalStore = create<AddModalStore>((set) => ({
  step: 1,
  fileName: '',
  accidentName: '',
  startTime: 0,
  endTime: 0,
  videoRef: createRef<HTMLVideoElement>(),

  async initAddModal() {
    set({ fileName: await window.electron.addModal.getInitialFileName() });
  },

  initTime(duration) {
    set({ endTime: duration });
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
}));