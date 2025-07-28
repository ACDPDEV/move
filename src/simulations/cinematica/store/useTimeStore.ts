import { create } from 'zustand';
import { useEntityStore } from './useEntityStore';

type TimeStore = {
    time: number;
    fps: number;
    speed: number;
    isPlaying: boolean;
    inputTimeChange: number;
    movementPrediction: boolean;
    delta: number;
    lastTimeUpdate: number;

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
    updateInputTimeChange: (value: number) => void;
    updatePrediction: (value: boolean) => void;
    togglePrediction: () => void;
    updateLastTimeUpdate: (date: number) => void;
    setNowLatest: () => void;
    addTime: (time: number) => void;
    calculateDelta: () => void;
    runLoopTime: () => void;
};

const useTimeStore = create<TimeStore>((set, get) => ({
    time: 0,
    fps: 0,
    speed: 1.0,
    isPlaying: false,
    inputTimeChange: 0,
    movementPrediction: false,
    delta: 0,
    lastTimeUpdate: performance.now() / 1000,

    play: () => set({ isPlaying: true }),
    pause: () => set({ isPlaying: false }),
    togglePlayer: () => set({ isPlaying: !get().isPlaying }),
    reset: () => {
        const timeBeforeReset = get().time;
        const updateAllEntities = useEntityStore.getState().updateAllEntities;
        updateAllEntities(-timeBeforeReset);
        set({ time: 0, isPlaying: false });
    },
    updateSpeed: (speed) => set({ speed: Math.max(0.1, Math.min(3, speed)) }),
    increaseSpeed: () => set({ speed: Math.min(3, get().speed + 0.1) }),
    decreaseSpeed: () => set({ speed: Math.max(0.1, get().speed - 0.1) }),
    updateTime: (time) => set({ time }),
    updateFPS: (fps) => set({ fps }),
    updateDelta: (delta) => set({ delta }),
    updateInputTimeChange: (value) => set({ inputTimeChange: value }),
    updatePrediction: (value) => set({ movementPrediction: value }),
    togglePrediction: () =>
        set({ movementPrediction: !get().movementPrediction }),
    updateLastTimeUpdate: (date) => set({ lastTimeUpdate: date }),
    setNowLatest: () => set({ lastTimeUpdate: performance.now() / 1000 }),
    addTime: (time) => set({ time: get().time + time }),
    calculateDelta: () => {
        const now = performance.now() / 1000;
        const delta = now - get().lastTimeUpdate;
        set({ delta: delta });
    },
    runLoopTime: () => {
        const now = performance.now() / 1000;
        const delta = now - get().lastTimeUpdate;
        const fps = 1 / delta;
        let time = get().time;
        if (get().isPlaying) {
            time += delta;
        }
        set({ delta: delta, fps: fps, time: time, lastTimeUpdate: now });
    },
}));

export { useTimeStore, type TimeStore };
