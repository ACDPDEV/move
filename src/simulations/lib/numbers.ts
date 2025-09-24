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

export { radiansToDegrees, degreesToRadians, scientificNotation };
