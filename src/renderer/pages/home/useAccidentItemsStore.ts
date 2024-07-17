import { produce } from "immer";
import { create } from "zustand";

interface AccidentItemsStore {
  selectedItemIndexes: Set<number>,
  lastSelectedItemIndex: number,
  selectItems: (index: number, isRange: boolean) => void,
  unselectAllItems: () => void,
}

export const useAccidentItemsStore = create<AccidentItemsStore>((set, get) => ({
  selectedItemIndexes: new Set(),
  lastSelectedItemIndex: -1,

  selectItems(index, isRange = false) {
    if (isRange) {
      set(
        produce((state: AccidentItemsStore) => {
          if (state.lastSelectedItemIndex === -1) {
            state.selectedItemIndexes.add(index);
            state.lastSelectedItemIndex = index;
          } else {
            const min = Math.min(state.lastSelectedItemIndex, index);
            const max = Math.max(state.lastSelectedItemIndex, index);

            for (let i = min; i <= max; i++) {
              state.selectedItemIndexes.add(i);
            }
          }
        })
      );
    } else {
      set(
        produce((state: AccidentItemsStore) => {
          if (state.selectedItemIndexes.has(index)) {
            state.selectedItemIndexes.delete(index);
          } else {
            state.selectedItemIndexes.add(index);
            state.lastSelectedItemIndex = index;
          }
        })
      );
    }

    console.log(`new lastSelectedItemIndex: ${get().lastSelectedItemIndex}`);
  },

  unselectAllItems() {
    set({ selectedItemIndexes: new Set(), lastSelectedItemIndex: -1 });
  },
}));