import { create } from "zustand";
import { Accident, AccidentInput, CollisionStatusSetting, OrderSetting, SortBySetting } from "../../main/types";

interface AccidentSortOptions {
  sort: SortBySetting;
  order: OrderSetting;
}

interface AccidentFilterOptions {
  collisionStatus?: CollisionStatusSetting;
}

interface AccidentsStore {
  accidents: Accident[];
  nameFilter: string;
  
  initAccidents: () => Promise<void>;
  getProcessedAccidents: (sortOptions: AccidentSortOptions, filterOptions?: AccidentFilterOptions) => Accident[];
  addAccident: (accident: AccidentInput) => Promise<void>;
  deleteAccident: (id: number) => Promise<void>;
  filterName: (nameFilter: string) => void;
}

export const useAccidentsStore = create<AccidentsStore>((set, get) => ({
  accidents: [],
  nameFilter: '',

  async initAccidents() {
    const accidents = await window.electron.db.accidents.getAll();
    set({ accidents });
    
    window.electron.db.accidents.onChange((updatedAccident) => {
      set((state) => {
        const newAccidents = [...state.accidents];
        const oldAccidentIndex = state.accidents.findIndex((accident) => accident.id === updatedAccident.id);

        if (oldAccidentIndex === -1) {
          newAccidents.push(updatedAccident);
        } else {
          newAccidents[oldAccidentIndex] = updatedAccident;
        }

        return { accidents: newAccidents }
      })
    });

    window.electron.db.accidents.onDelete((id) => {
      set((state) => {
        return { accidents: state.accidents.filter((accident) => accident.id !== id) }
      })
    })
  },

  getProcessedAccidents(sortOptions, filterOptions) {
    let processedAccidents;

    if (filterOptions) {
      processedAccidents = get().accidents.filter((accident) => {
        if (get().nameFilter && !accident.name.includes(get().nameFilter)) {
          return false;
        }

        if (
          filterOptions.collisionStatus !== undefined && (
            (filterOptions.collisionStatus === 'collision' && accident.collidingVehicle === 0) ||
            (filterOptions.collisionStatus === 'no-collision'  && accident.collidingVehicle !== 0)
          )
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

  filterName(nameFilter) {
    set({ nameFilter });
  },
}));