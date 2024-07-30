import { create } from "zustand";

type AddModalStep = 1 | 2 | 3;

interface AddModalStore {
  step: AddModalStep;
  goToPreviousStep: () => void;
  goToNextStep: () => void;
}

export const useAddModalStore = create<AddModalStore>((set) => ({
  step: 1,
  goToPreviousStep: () => set((state) => ({
    step: (state.step > 1 ? state.step - 1 : state.step) as AddModalStep
  })),
  goToNextStep: () => set((state) => ({
    step: (state.step < 3 ? state.step + 1 : state.step) as AddModalStep
  })),
}));