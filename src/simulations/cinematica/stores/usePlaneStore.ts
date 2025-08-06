import { create } from 'zustand';

type PlaneStore = {
    position: { x: number; y: number };
    scale: number;
    minScale: number;
    maxScale: number;
    minGridsWidthInScreen: number;
    maxGridsWidthInScreen: number;
    zoomSensitivity: number;
    moveSensitivity: number;
    setPosition: (position: { x: number; y: number }) => void;
    setScale: (scale: number) => void;
};

const usePlaneStore = create<PlaneStore>((set) => ({
    position: { x: 1, y: -1 },
    scale: 300,
    minScale: 0.00001,
    maxScale: 100000000,
    minGridsWidthInScreen: 3,
    maxGridsWidthInScreen: 10,
    zoomSensitivity: 0.1,
    moveSensitivity: 1,
    setPosition: (position) => set({ position: position }),
    setScale: (scale) => set({ scale: scale }),
}));

export { usePlaneStore, type PlaneStore };
