import { create } from 'zustand';

type SidebarStore = {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    toggleIsOpen: () => void;
};

const useSidebarStore = create<SidebarStore>((set, get) => ({
    isOpen: false,
    setIsOpen: (isOpen) => set({ isOpen: isOpen }),
    toggleIsOpen: () => set({ isOpen: !get().isOpen }),
}));

export { useSidebarStore, type SidebarStore };
