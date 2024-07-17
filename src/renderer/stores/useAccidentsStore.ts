import { create } from "zustand";
import { Accident, AccidentInput, CollisionStatusSettingValue, OrderSettingValue, SortBySettingValue } from "../../types";
import { produce } from "immer";

interface AccidentSortOptions {
  sort: SortBySettingValue;
  order: OrderSettingValue;
}

interface AccidentFilterOptions {
  name: string;
  collisionStatus: CollisionStatusSettingValue;
}

interface AccidentsStore {
  accidents: Accident[];
  
  initAccidents: () => Promise<void>;
  getProcessedAccidents: (sortOptions: AccidentSortOptions, filterOptions: AccidentFilterOptions) => Accident[];
  addAccident: (accident: AccidentInput) => Promise<void>;
  deleteAccident: (id: number) => Promise<void>;
}

export const useAccidentsStore = create<AccidentsStore>((set, get) => ({
  accidents: [],

  async initAccidents() {
    const accidents = await window.electron.db.accidents.getAll();
    set({ accidents });
    
    window.electron.db.accidents.onChange((updatedAccident) => {
      set(
        produce((state: AccidentsStore) => {
          const oldAccidentIndex = state.accidents.findIndex((accident) => accident.id === updatedAccident.id);

          if (oldAccidentIndex === -1) {
            state.accidents.push(updatedAccident);
          } else {
            state.accidents[oldAccidentIndex] = updatedAccident;
          }
        })
      )
    });

    window.electron.db.accidents.onDelete((id) => {
      set((state) => ({
        accidents: state.accidents.filter((accident) => accident.id !== id)
      }));
    });
  },

  getProcessedAccidents(sortOptions, filterOptions) {
    let processedAccidents;

    if (filterOptions) {
      processedAccidents = get().accidents.filter((accident) => {
        if (!accident.name.toLowerCase().includes(filterOptions.name.toLowerCase())) {
          return false;
        }

        if (
          (filterOptions.collisionStatus === 'collision' && accident.collidingVehicle === 0) ||
          (filterOptions.collisionStatus === 'no-collision'  && accident.collidingVehicle !== 0)
        ) {
          return false;
        }

        return true;
      })
    } else {
      processedAccidents = get().accidents;
    }

    processedAccidents.sort((a, b) => {
      let aVal, bVal;

      if (sortOptions.sort === 'date') {
        aVal = a.dateCreated;
        bVal = b.dateCreated;
      } else {
        aVal = a.name;
        bVal = b.name;
      }
      
      if (sortOptions.order === 'asc') {
        return aVal.localeCompare(bVal);
      } else {
        return bVal.localeCompare(aVal);
      }
    })

    return processedAccidents;
  },

  async addAccident(accident) {
    await window.electron.db.accidents.add(accident);
  },

  async deleteAccident(id) {
    await window.electron.db.accidents.deleteOne(id);
  },
}));