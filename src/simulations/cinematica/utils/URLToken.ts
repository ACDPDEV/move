const encodeURLParam = (json: string) =>
    json
        .replace(/"/g, '~') // comillas → tilde
        .replace(/:/g, '_') // dos puntos → guion bajo
        .replace(/{/g, 'z') // llave izquierda → z
        .replace(/}/g, 'Z') // llave derecha → Z
        .replace(/\[/g, 'y') // corchete izquierdo → y
        .replace(/\]/g, 'Y') // corchete derecho → Y
        .replace(/,/g, 'x') // coma → x
        .replace(/\./g, 'X') // coma → X
        .replace(/#/g, 'w'); // # -> w

const decodeURLParam = (str: string) =>
    str
        .replace(/~/g, '"')
        .replace(/_/g, ':')
        .replace(/z/g, '{')
        .replace(/Z/g, '}')
        .replace(/y/g, '[')
        .replace(/Y/g, ']')
        .replace(/x/g, ',')
        .replace(/X/g, '.')
        .replace(/w/g, '#');

export { encodeURLParam, decodeURLParam };
