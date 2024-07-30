import { create } from "zustand";

type AddModalStep = 1 | 2 | 3;

interface AddModalStore {
  step: AddModalStep;
  fileName: string;
  initAddModal: () => Promise<void>;
  goToPreviousStep: () => void;
  goToNextStep: () => void;
  setFileName: (fileName: string) => void;
}

export const useAddModalStore = create<AddModalStore>((set) => ({
  step: 1,
  fileName: '',

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
}));