import { Display, Inputs } from '../stores/useOptionsStore';

function compressOptions(display: Display, inputs: Inputs): boolean[] {
    const displayOptions = Object.values(display);
    const inputOptions = Object.values(inputs);

    const compressedOptions = [...displayOptions, ...inputOptions];

    return compressedOptions.map((option) => Boolean(option));
}

function decompressOptions(compressed: boolean[]): {
    display: Display;
    inputs: Inputs;
} {
    return {
        display: {
            positionVectorResultant: compressed[0],
            positionVectorComponents: compressed[1],
            positionVectorAngle: compressed[2],
            velocityVectorResultant: compressed[3],
            velocityVectorComponents: compressed[4],
            velocityVectorAngle: compressed[5],
            accelerationVectorResultant: compressed[6],
            accelerationVectorComponents: compressed[7],
            accelerationVectorAngle: compressed[8],
            trajectory: compressed[9],
            coordinates: compressed[10],
            spin: compressed[11],
            fps: compressed[12],
        },
        inputs: {
            position: compressed[13],
            velocity: compressed[14],
            acceleration: compressed[15],
            radius: compressed[16],
            color: compressed[17],
        },
    };
}

export { compressOptions, decompressOptions };
