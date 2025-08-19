function parseNumber(
    input: string,
    inputName: string,
    int: boolean = false,
    min: number | undefined = undefined,
    max: number | undefined = undefined,
) {
    const n = Number(input);
    if (isNaN(n)) {
        return inputName + ' solo puede ser un número';
    }
    if (int && n % 1 !== 0) {
        return inputName + ' debe ser un número entero';
    }
    if (min && n < min) {
        return inputName + ' debe ser mayor o igual a ' + min;
    }
    if (max && n > max) {
        return inputName + ' debe ser menor o igual a ' + max;
    }
    return null;
}

function trimInput(input: string) {
    return input.replace(/^0+(?=\d)/, '').replace(/^0+$/, '');
}

export { parseNumber, trimInput };
