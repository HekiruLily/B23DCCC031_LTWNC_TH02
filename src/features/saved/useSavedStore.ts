import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface SavedState {
  ids: string[];
  toggle: (id: string) => void;
}

export const useSavedStore = create<SavedState>()(
  persist(
    (set, get) => ({
      ids: [],
      toggle: (id: string) => {
        const { ids } = get();
        if (ids.includes(id)) {
          set({ ids: ids.filter((item) => item !== id) });
        } else {
          set({ ids: [...ids, id] });
        }
      },
    }),
    {
      name: 'workout-saved',
    }
  )
);

