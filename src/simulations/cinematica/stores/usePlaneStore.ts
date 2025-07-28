import { create } from 'zustand';

type PlaneStore = {
    position: { x: number; y: number };
    scale: number;
    gap: number;
    minScale: number;
    maxScale: number;
    minGridsWidthInScreen: number;
    maxGridsWidthInScreen: number;
    zoomSensitivity: number;
    moveSensitivity: number;
    setPosition: (position: { x: number; y: number }) => void;
    setScale: (scale: number) => void;
    setGap: (gap: number) => void;
};

const usePlaneStore = create<PlaneStore>((set) => ({
    position: { x: 1, y: -1 },
    scale: 300,
    gap: 0.5,
    minScale: 0.5,
    maxScale: 1000,
    minGridsWidthInScreen: 3,
    maxGridsWidthInScreen: 10,
    zoomSensitivity: 0.001,
    moveSensitivity: 1,
    setPosition: (position) => set({ position: position }),
    setScale: (scale) => set({ scale: scale }),
    setGap: (gap) => set({ gap: gap }),
}));

export { usePlaneStore, type PlaneStore };
