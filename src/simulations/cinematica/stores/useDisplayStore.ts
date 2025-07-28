import { create } from 'zustand';

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
};

export const useDisplayStore = create<DisplayStore>((set, get) => ({
    position: { resultant: false, components: false, angle: false },
    velocity: { resultant: false, components: false, angle: false },
    acceleration: { resultant: false, components: false, angle: false },
    trajectory: false,
    coordinates: false,
    axes: false,
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
}));
