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
}

export function compressDisplay(display: Display): string {
    const pr = display.position.resultant ? 1 : 0;
    const pc = display.position.components ? 1 : 0;
    const pa = display.position.angle ? 1 : 0;
    const vr = display.velocity.resultant ? 1 : 0;
    const vc = display.velocity.components ? 1 : 0;
    const va = display.velocity.angle ? 1 : 0;
    const ar = display.acceleration.resultant ? 1 : 0;
    const ac = display.acceleration.components ? 1 : 0;
    const aa = display.acceleration.angle ? 1 : 0;
    const tr = display.trajectory ? 1 : 0;
    const cr = display.coordinates ? 1 : 0;
    const ax = display.axes ? 1 : 0;

    const Base10FromBinary =
        pr * Math.pow(2, 0) +
        pc * Math.pow(2, 1) +
        pa * Math.pow(2, 2) +
        vr * Math.pow(2, 3) +
        vc * Math.pow(2, 4) +
        va * Math.pow(2, 5) +
        ar * Math.pow(2, 6) +
        ac * Math.pow(2, 7) +
        aa * Math.pow(2, 8) +
        tr * Math.pow(2, 9) +
        cr * Math.pow(2, 10) +
        ax * Math.pow(2, 11);

    return Base10FromBinary.toString();
}

export function decompressDisplay(compressed: string): Display {
    const Base10ToBinary = parseInt(compressed, 10);

    const pr = Base10ToBinary % 2;
    const pc = Math.floor(Base10ToBinary / Math.pow(2, 1)) % 2;
    const pa = Math.floor(Base10ToBinary / Math.pow(2, 2)) % 2;
    const vr = Math.floor(Base10ToBinary / Math.pow(2, 3)) % 2;
    const vc = Math.floor(Base10ToBinary / Math.pow(2, 4)) % 2;
    const va = Math.floor(Base10ToBinary / Math.pow(2, 5)) % 2;
    const ar = Math.floor(Base10ToBinary / Math.pow(2, 6)) % 2;
    const ac = Math.floor(Base10ToBinary / Math.pow(2, 7)) % 2;
    const aa = Math.floor(Base10ToBinary / Math.pow(2, 8)) % 2;
    const tr = Math.floor(Base10ToBinary / Math.pow(2, 9)) % 2;
    const cr = Math.floor(Base10ToBinary / Math.pow(2, 10)) % 2;
    const ax = Math.floor(Base10ToBinary / Math.pow(2, 11)) % 2;

    return {
        position: {
            resultant: pr === 1,
            components: pc === 1,
            angle: pa === 1,
        },
        velocity: {
            resultant: vr === 1,
            components: vc === 1,
            angle: va === 1,
        },
        acceleration: {
            resultant: ar === 1,
            components: ac === 1,
            angle: aa === 1,
        },
        trajectory: tr === 1,
        coordinates: cr === 1,
        axes: ax === 1,
    };
}
