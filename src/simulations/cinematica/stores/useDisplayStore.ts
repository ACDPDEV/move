import { create } from 'zustand';

interface Display {
    position: {
        resultant: boolean;
        components: boolean;
        angle: boolean;
    };
    velocity: {
        resultant: boolean;
        components: boolean;
        angle: boolean;
    };
    acceleration: {
        resultant: boolean;
        components: boolean;
        angle: boolean;
    };
    trajectory: boolean;
    coordinates: boolean;
    axes: boolean;
    fps: boolean;
}

type DisplayStore = {
    position: {
        resultant: boolean;
        components: boolean;
        angle: boolean;
    };
    velocity: {
        resultant: boolean;
        components: boolean;
        angle: boolean;
    };
    acceleration: {
        resultant: boolean;
        components: boolean;
        angle: boolean;
    };
    trajectory: boolean;
    coordinates: boolean;
    axes: boolean;
    fps: boolean;
    togglePositionResultant: () => void;
    togglePositionComponents: () => void;
    togglePositionAngle: () => void;
    toggleVelocityResultant: () => void;
    toggleVelocityComponents: () => void;
    toggleVelocityAngle: () => void;
    toggleAccelerationResultant: () => void;
    toggleAccelerationComponents: () => void;
    toggleAccelerationAngle: () => void;
    toggleTrajectory: () => void;
    toggleCoordinates: () => void;
    toggleAxes: () => void;
    toggleFps: () => void;
    setDisplay: (display: Display) => void;
    toProps: () => Display;
};

export const useDisplayStore = create<DisplayStore>((set, get) => ({
    position: { resultant: false, components: false, angle: false },
    velocity: { resultant: false, components: false, angle: false },
    acceleration: { resultant: false, components: false, angle: false },
    trajectory: false,
    coordinates: false,
    axes: false,
    fps: false,
    togglePositionResultant: () =>
        set({
            position: {
                ...get().position,
                resultant: !get().position.resultant,
            },
        }),
    togglePositionComponents: () =>
        set({
            position: {
                ...get().position,
                components: !get().position.components,
            },
        }),
    togglePositionAngle: () =>
        set({ position: { ...get().position, angle: !get().position.angle } }),
    toggleVelocityResultant: () =>
        set({
            velocity: {
                ...get().velocity,
                resultant: !get().velocity.resultant,
            },
        }),
    toggleVelocityComponents: () =>
        set({
            velocity: {
                ...get().velocity,
                components: !get().velocity.components,
            },
        }),
    toggleVelocityAngle: () =>
        set({ velocity: { ...get().velocity, angle: !get().velocity.angle } }),
    toggleAccelerationResultant: () =>
        set({
            acceleration: {
                ...get().acceleration,
                resultant: !get().acceleration.resultant,
            },
        }),
    toggleAccelerationComponents: () =>
        set({
            acceleration: {
                ...get().acceleration,
                components: !get().acceleration.components,
            },
        }),
    toggleAccelerationAngle: () =>
        set({
            acceleration: {
                ...get().acceleration,
                angle: !get().acceleration.angle,
            },
        }),
    toggleTrajectory: () => set({ trajectory: !get().trajectory }),
    toggleCoordinates: () => set({ coordinates: !get().coordinates }),
    toggleAxes: () => set({ axes: !get().axes }),
    toggleFps: () => set({ fps: !get().fps }),
    setDisplay: (display) => set(display),
    toProps: () => {
        return {
            position: {
                resultant: get().position.resultant,
                components: get().position.components,
                angle: get().position.angle,
            },
            velocity: {
                resultant: get().velocity.resultant,
                components: get().velocity.components,
                angle: get().velocity.angle,
            },
            acceleration: {
                resultant: get().acceleration.resultant,
                components: get().acceleration.components,
                angle: get().acceleration.angle,
            },
            trajectory: get().trajectory,
            coordinates: get().coordinates,
            axes: get().axes,
            fps: get().fps,
        };
    },
}));
