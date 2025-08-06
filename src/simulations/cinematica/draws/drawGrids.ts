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

    ctx.strokeStyle = dark ? '#999' : '#777';
    ctx.lineWidth = 0.5;

    // Calcular posiciones de inicio usando módulo
    let startX = pX % gap;
    let startY = pY % gap;

    // Si el módulo es negativo, ajustar para que esté en rango positivo
    if (startX < 0) startX += gap;
    if (startY < 0) startY += gap;

    // Líneas verticales
    // Empezar desde antes del borde izquierdo y terminar después del derecho
    for (let x = startX - gap; x <= width + gap; x += gap) {
        if (x >= 0 && x <= width) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.stroke();
        }
    }

    // Líneas horizontales
    // Empezar desde antes del borde superior y terminar después del inferior
    for (let y = startY - gap; y <= height + gap; y += gap) {
        if (y >= 0 && y <= height) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }
    }
}

export { drawGrids };
