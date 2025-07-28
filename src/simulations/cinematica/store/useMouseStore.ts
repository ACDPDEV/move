import { create } from 'zustand';

type MouseStore = {
    isDown: boolean;
    startPosition: { x: number; y: number };
    currentPosition: { x: number; y: number };
    deltaPosition: { x: number; y: number };
    setIsDown: (isDown: boolean) => void;
    toggleIsDown: () => void;
    setStartPosition: (position: { x: number; y: number }) => void;
    setCurrentPosition: (position: { x: number; y: number }) => void;
    setDeltaPosition: (position: { x: number; y: number }) => void;
};

const useMouseStore = create<MouseStore>((set, get) => ({
    isDown: false,
    startPosition: { x: 0, y: 0 },
    currentPosition: { x: 0, y: 0 },
    deltaPosition: { x: 0, y: 0 },

    setIsDown: (isDown) => set({ isDown }),
    toggleIsDown: () => set({ isDown: !get().isDown }),
    setStartPosition: (position) => set({ startPosition: position }),
    setCurrentPosition: (position) => set({ currentPosition: position }),
    setDeltaPosition: (position) => set({ deltaPosition: position }),
}));

export { useMouseStore, type MouseStore };
