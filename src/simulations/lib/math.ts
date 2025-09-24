function radiansToDegrees(radians: number): number {
    return radians * (180 / Math.PI);
}

function degreesToRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
}

function scientificNotation(
    number: number,
    fromOrder: number = 3,
    fromDecimals: number = 2,
): string {
    if (Math.abs(number) < Math.pow(10, -fromDecimals) && number !== 0) {
        return number.toExponential(2);
    }
    if (Math.abs(number) > Math.pow(10, fromOrder)) {
        return number.toExponential(2);
    }
    return number.toFixed(2);
}

function cartesianToPolar(x: number, y: number) {
    const angleRad = Math.atan2(y, x);
    const mag = Math.hypot(x, y);
    return { angleDeg: radiansToDegrees(angleRad), mag };
}

function polarToCartesian(angleDeg: number, mag: number) {
    const a = degreesToRadians(angleDeg);
    return { x: mag * Math.cos(a), y: mag * Math.sin(a) };
}

const parseNumber = (s: string): number | null => {
    if (s.trim() === '') return null;
    const n = Number(s);
    return Number.isFinite(n) ? n : null;
};

export {
    radiansToDegrees,
    degreesToRadians,
    scientificNotation,
    cartesianToPolar,
    polarToCartesian,
    parseNumber,
};
