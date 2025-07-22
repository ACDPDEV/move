import { create } from 'zustand'

type SelectedEntityStore = {
  selectedEntityId: string | null
  setSelectedEntityId: (id: string | null) => void
}

export const useSelectedEntityStore = create<SelectedEntityStore>((set) => ({
  selectedEntityId: null,
  setSelectedEntityId: (id) => set({ selectedEntityId: id }),
}))
