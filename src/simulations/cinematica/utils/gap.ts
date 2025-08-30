function gapFactor(number: number): number {
    if (number === 0) return 0;
    const stringFromNumber = number.toString();
    const [intPart, decimalPart = ''] = stringFromNumber.split('.');
    if (intPart !== '0') {
        const digits = intPart.length;
        return digits;
    }
    const match = decimalPart.match(/^0+/);
    const count = match ? match[0].length : 0;
    return count * -1;
}

function getGap(length: number, scale: number): number {
    const rel = length / scale;
    const gap = Math.pow(10, gapFactor(rel) - 1) * scale;
    return gap;
}

export { getGap, gapFactor };
