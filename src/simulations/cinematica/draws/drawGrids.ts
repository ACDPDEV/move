import { usePlaneStore } from '../stores/usePlaneStore';

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
    return count;
}

function getGap(length: number, scale: number): number {
    const rel = length / scale;
    const gap = Math.pow(10, gapFactor(rel) - 1) * scale;
    return gap;
}

function drawGrids(ctx: CanvasRenderingContext2D, dark: boolean): void {
    const plane = usePlaneStore.getState();

    const { width, height } = ctx.canvas;
    const [pX, pY] = [
        plane.position.x * plane.scale,
        plane.position.y * plane.scale * -1,
    ];

    // Separación en base diez, números de la forma 10**n
    const gap =
        width > height
            ? getGap(height, plane.scale)
            : getGap(width, plane.scale);

    // Prevenir bucles infinitos
    if (gap <= 0.1) {
        return;
    }

    const pointer = { x: pX, y: pY };

    ctx.strokeStyle = dark ? '#999' : '#777';
    ctx.lineWidth = 0.5;

    let lineCount = 0;

    // Líneas verticales hacia la derecha
    while (pointer.x <= width) {
        ctx.beginPath();
        ctx.moveTo(pointer.x, 0);
        ctx.lineTo(pointer.x, height);
        ctx.stroke();
        pointer.x += gap;
        lineCount++;
        if (lineCount > 1000) {
            // Safety break
            console.error('Too many lines - breaking loop');
            break;
        }
    }

    // Reset x position para ir hacia la izquierda
    pointer.x = pX - gap;
    while (pointer.x >= 0) {
        ctx.beginPath();
        ctx.moveTo(pointer.x, 0);
        ctx.lineTo(pointer.x, height);
        ctx.stroke();
        pointer.x -= gap;
        lineCount++;
        if (lineCount > 1000) {
            // Safety break
            console.error('Too many lines - breaking loop');
            break;
        }
    }

    // Reset y position y líneas horizontales hacia abajo
    pointer.y = pY;
    while (pointer.y <= height) {
        ctx.beginPath();
        ctx.moveTo(0, pointer.y);
        ctx.lineTo(width, pointer.y);
        ctx.stroke();
        pointer.y += gap;
        lineCount++;
        if (lineCount > 1000) {
            // Safety break
            console.error('Too many lines - breaking loop');
            break;
        }
    }

    // Reset y position para ir hacia arriba
    pointer.y = pY - gap;
    while (pointer.y >= 0) {
        ctx.beginPath();
        ctx.moveTo(0, pointer.y);
        ctx.lineTo(width, pointer.y);
        ctx.stroke();
        pointer.y -= gap;
        lineCount++;
        if (lineCount > 1000) {
            // Safety break
            console.error('Too many lines - breaking loop');
            break;
        }
    }
}

export { drawGrids };
