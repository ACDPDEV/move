import {
    Display,
    Inputs,
} from '@/simulations/cinematica/stores/useOptionsStore';

function compressOptions(display: Display, inputs: Inputs): string {
    const displayOptions = Object.values(display).map((value) =>
        value ? 1 : 0,
    );
    const inputOptions = Object.values(inputs).map((value) => {
        if (typeof value === 'boolean') {
            return value ? 1 : 0;
        } else if (typeof value === 'number') {
            return value;
        } else {
            return 0;
        }
    });

    const compressedOptions = [...displayOptions, ...inputOptions];
    let stringOptions = '';
    for (let i = 0; i < compressedOptions.length; i++) {
        stringOptions += compressedOptions[i].toString();
    }

    return stringOptions;
}

function decompressOptions(compressed: string): {
    display: Display;
    inputs: Inputs;
} {
    const compressedArray = [];
    for (let i = 0; i < compressed.length; i++) {
        compressedArray.push(parseInt(compressed[i]));
    }
    return {
        display: {
            positionVectorResultant: Boolean(compressedArray[0]),
            positionVectorComponents: Boolean(compressedArray[1]),
            positionVectorAngle: Boolean(compressedArray[2]),
            velocityVectorResultant: Boolean(compressedArray[3]),
            velocityVectorComponents: Boolean(compressedArray[4]),
            velocityVectorAngle: Boolean(compressedArray[5]),
            accelerationVectorResultant: Boolean(compressedArray[6]),
            accelerationVectorComponents: Boolean(compressedArray[7]),
            accelerationVectorAngle: Boolean(compressedArray[8]),
            trajectory: Boolean(compressedArray[9]),
            coordinates: Boolean(compressedArray[10]),
            spin: Boolean(compressedArray[11]),
            fps: Boolean(compressedArray[12]),
        },
        inputs: {
            position: Boolean(compressedArray[13]),
            velocity: Boolean(compressedArray[14]),
            acceleration: Boolean(compressedArray[15]),
            radius: Boolean(compressedArray[16]),
            color: Boolean(compressedArray[17]),
            floatPrecision: compressedArray[18],
        },
    };
}

export { compressOptions, decompressOptions };
