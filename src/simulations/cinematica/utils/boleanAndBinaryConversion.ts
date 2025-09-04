function booleanToBinary(array: boolean[]): number {
    let number = 0;
    for (let i = 0; i < array.length; i++) {
        if (array[i]) {
            number += Math.pow(2, i);
        }
    }
    return number;
}

function binaryToBoolean(number: number): boolean[] {
    const array = [];
    for (let i = 0; i < 32; i++) {
        array.push((number & Math.pow(2, i)) !== 0);
    }
    return array;
}

export { booleanToBinary, binaryToBoolean };
