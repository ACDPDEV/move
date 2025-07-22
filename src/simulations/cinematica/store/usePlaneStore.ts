// En tu store (por ejemplo, planeStore.ts)
import { create } from "zustand";
import { AbsolutePlaneState } from "../types";

type PlaneStore = {
  plane: AbsolutePlaneState;
  setPosition: (position: AbsolutePlaneState['position']) => void;
  setScale: (scale: AbsolutePlaneState['scale']) => void;
};

export const usePlaneStore = create<PlaneStore>((set, get) => ({
  plane: {
    position: { x: 400, y: 300 },
    scale: 1,
  },
  setPosition: (position) => set({ plane: { ...get().plane, position } }),
  setScale: (scale) => set({ plane: { ...get().plane, scale } }),
}));
