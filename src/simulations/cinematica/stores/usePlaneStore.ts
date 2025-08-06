import { create } from 'zustand';

type PlaneStore = {
    position: { x: number; y: number };
    scale: number;
    minScale: number;
    maxScale: number;
    zoomSensitivity: number;
    moveSensitivity: number;
    setPosition: (position: { x: number; y: number }) => void;
    setScale: (scale: number) => void;
    setMinScale: (minScale: number) => void;
    setMaxScale: (maxScale: number) => void;
    setZoomSensitivity: (zoomSensitivity: number) => void;
    setMoveSensitivity: (moveSensitivity: number) => void;
};

const usePlaneStore = create<PlaneStore>((set) => ({
    position: { x: 1, y: -1 },
    scale: 300,
    minScale: 0.00001,
    maxScale: 100000000,
    zoomSensitivity: 0.1,
    moveSensitivity: 1,
    setPosition: (position) => set({ position: position }),
    setScale: (scale) => set({ scale: scale }),
    setMinScale: (minScale) => set({ minScale: minScale }),
    setMaxScale: (maxScale) => set({ maxScale: maxScale }),
    setZoomSensitivity: (zoomSensitivity) =>
        set({ zoomSensitivity: zoomSensitivity }),
    setMoveSensitivity: (moveSensitivity) =>
        set({ moveSensitivity: moveSensitivity }),
}));

export { usePlaneStore, type PlaneStore };
