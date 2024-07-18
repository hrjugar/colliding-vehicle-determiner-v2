import { produce } from "immer";
import { create } from "zustand";

interface AccidentItemsStore {
  selectedItemIndexes: Set<number>,
  lastSelectedItemIndex: number,
  lastSelectedRangeItemIndex: number,
  selectItems: (index: number, isRange: boolean) => void,
  unselectAllItems: () => void,
}

export const useAccidentItemsStore = create<AccidentItemsStore>((set, get) => ({
  selectedItemIndexes: new Set(),
  lastSelectedItemIndex: -1,
  lastSelectedRangeItemIndex: -1,

  selectItems(index, isRange = false) {
    if (isRange) {
      set(
        produce((state: AccidentItemsStore) => {
          if (state.lastSelectedItemIndex === -1) {
            state.selectedItemIndexes.add(index);
            state.lastSelectedItemIndex = index;
          } else {
            const minIndex = Math.min(state.lastSelectedItemIndex, index);
            const maxIndex = Math.max(state.lastSelectedItemIndex, index);

            for (let i = minIndex; i <= maxIndex; i++) {
              state.selectedItemIndexes.add(i);
            }

            if (state.lastSelectedRangeItemIndex !== -1) {
              if (state.lastSelectedItemIndex === minIndex && index < state.lastSelectedRangeItemIndex) {
                for (let i = index + 1; i <= state.lastSelectedRangeItemIndex; i++) {
                  state.selectedItemIndexes.delete(i);
                }
              } else if (state.lastSelectedItemIndex === maxIndex && index > state.lastSelectedRangeItemIndex) {
                for (let i = state.lastSelectedRangeItemIndex; i <= index - 1; i++) {
                  state.selectedItemIndexes.delete(i);
                }
              }
            }

            state.lastSelectedRangeItemIndex = index;
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

          state.lastSelectedRangeItemIndex = -1;
        })
      );
    }

    console.log(`new lastSelectedItemIndex: ${get().lastSelectedItemIndex}`);
  },

  unselectAllItems() {
    set({ selectedItemIndexes: new Set(), lastSelectedItemIndex: -1, lastSelectedRangeItemIndex: -1 });
  },
}));