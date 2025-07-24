import { create } from 'zustand';
import { useEntityStore } from './useEntityStore';

type TimeStore = {
    time: number;
    fps: number;
    speed: number;
    isPlaying: boolean;
    timeBeforeReset: number;
    inputTimeChange: number;
    movementPrediction: boolean;
    delta: number;

    play: () => void;
    pause: () => void;
    togglePlayer: () => void;
    reset: () => void;
    updateSpeed: (speed: number) => void;
    increaseSpeed: () => void;
    decreaseSpeed: () => void;
    updateTime: (time: number) => void;
    updateFPS: (fps: number) => void;
    updateDelta: (delta: number) => void;
    updateTimeBeforeReset: (value: number) => void;
    updateInputTimeChange: (value: number) => void;
    updatePrediction: (value: boolean) => void;
};

const useTimeStore = create<TimeStore>((set, get) => ({
    time: 0,
    fps: 0,
    speed: 1.0,
    isPlaying: false,
    timeBeforeReset: 0,
    inputTimeChange: 0,
    movementPrediction: false,
    delta: 0,

    play: () => set({ isPlaying: true }),
    pause: () => set({ isPlaying: false }),
    togglePlayer: () => set({ isPlaying: !get().isPlaying }),
    reset: () => {
        const timeBeforeReset = get().time;
        const updateAllEntities = useEntityStore.getState().updateAllEntities;
        updateAllEntities(-timeBeforeReset * 2);
        set({ time: 0, isPlaying: false });
    },
    updateSpeed: (speed) => set({ speed: Math.max(0.1, Math.min(3, speed)) }),
    increaseSpeed: () => set({ speed: Math.min(3, get().speed + 0.1) }),
    decreaseSpeed: () => set({ speed: Math.max(0.1, get().speed - 0.1) }),
    updateTime: (time) => set({ time }),
    updateFPS: (fps) => set({ fps }),
    updateDelta: (delta) => set({ delta }),
    updateTimeBeforeReset: (value) => set({ timeBeforeReset: value }),
    updateInputTimeChange: (value) => set({ inputTimeChange: value }),
    updatePrediction: (value) => set({ movementPrediction: value }),
}));

export { useTimeStore, type TimeStore };
