import { create } from 'zustand';

interface Display {
    positionVectorResultant: boolean;
    positionVectorComponents: boolean;
    positionVectorAngle: boolean;
    velocityVectorResultant: boolean;
    velocityVectorComponents: boolean;
    velocityVectorAngle: boolean;
    accelerationVectorResultant: boolean;
    accelerationVectorComponents: boolean;
    accelerationVectorAngle: boolean;
    trajectory: boolean;
    coordinates: boolean;
    spin: boolean;
    fps: boolean;
}

interface Inputs {
    position: boolean;
    velocity: boolean;
    acceleration: boolean;
    radius: boolean;
    color: boolean;
    floatPrecision: number;
}

type Option = keyof Display | keyof Inputs;

type OptionsStore = {
    display: Display;
    inputs: Inputs;
    toggleProperty: (property: keyof Display | keyof Inputs) => void;
    setProperty: (
        property: keyof Display | keyof Inputs,
        value: boolean | number,
    ) => void;
    setOptions: (options: { display: Display; inputs: Inputs }) => void;
    toProps: () => { display: Display; inputs: Inputs };
};

export const useOptionsStore = create<OptionsStore>((set, get) => ({
    display: {
        positionVectorResultant: false,
        positionVectorComponents: false,
        positionVectorAngle: false,
        velocityVectorResultant: false,
        velocityVectorComponents: false,
        velocityVectorAngle: false,
        accelerationVectorResultant: false,
        accelerationVectorComponents: false,
        accelerationVectorAngle: false,
        trajectory: false,
        coordinates: false,
        spin: false,
        fps: false,
    },
    inputs: {
        position: true,
        velocity: true,
        acceleration: true,
        radius: true,
        color: true,
        floatPrecision: 2,
    },
    toggleProperty: (property: Option) => {
        if (property in get().display) {
            set((state) => ({
                display: {
                    ...state.display,
                    [property]: !state.display[property as keyof Display],
                },
            }));
        } else if (property in get().inputs) {
            set((state) => ({
                inputs: {
                    ...state.inputs,
                    [property]: !state.inputs[property as keyof Inputs],
                },
            }));
        }
    },
    setProperty: (property, value) => {
        if (property in get().display) {
            set((state) => ({
                display: {
                    ...state.display,
                    [property]: value,
                },
            }));
        } else if (property in get().inputs) {
            set((state) => ({
                inputs: {
                    ...state.inputs,
                    [property]: value,
                },
            }));
        }
    },
    setOptions: (options: { display: Display; inputs: Inputs }) =>
        set(() => ({
            display: options.display,
            inputs: options.inputs,
        })),
    toProps: () => ({ display: get().display, inputs: get().inputs }),
}));

export type { Display, Inputs };
