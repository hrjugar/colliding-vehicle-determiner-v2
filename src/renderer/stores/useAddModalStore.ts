import { createRef, RefObject } from "react";
import { create } from "zustand";

type AddModalStep = 1 | 2 | 3;

interface AddModalStore {
  step: AddModalStep;
  filePath: string;
  accidentName: string;
  startTime: number;
  endTime: number;
  duration: number;
  videoRef: RefObject<HTMLVideoElement>;
  initAddModal: () => Promise<void>;
  initTime: (durationInSeconds: number) => void;
  goToPreviousStep: () => void;
  goToNextStep: () => void;
  updateFile: (filePath: string) => void;
  setAccidentName: (accidentName: string) => void;
  setStartTime: (startTime: number, currentTime?: number) => void;
  setEndTime: (endTime: number, currentTime?: number) => void;
}

export const useAddModalStore = create<AddModalStore>((set, get) => ({
  step: 1,
  filePath: '',
  accidentName: '',
  startTime: 0,
  endTime: 0,
  duration: 0,
  videoRef: createRef<HTMLVideoElement>(),

  async initAddModal() {
    set({ filePath: await window.electron.addModal.getInitialFilePath() });
  },

  initTime(duration) {
    set({ endTime: duration, duration });
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
  
  updateFile(filePath) { 
    set({ filePath, startTime: 0 }); 
  },

  setAccidentName(accidentName) { 
    set({ accidentName }) 
  },

  setStartTime(startTime) {
    set({ startTime }); 

    let video = get().videoRef.current;
    if (video) {
      video.currentTime = startTime;
    }
  },

  setEndTime(endTime) {
    set({ endTime });

    let video = get().videoRef.current;
    if (video) {
      video.currentTime = endTime;
    }
  },
}));