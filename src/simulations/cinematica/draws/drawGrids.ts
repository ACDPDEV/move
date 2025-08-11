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
    return count * -1;
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

    ctx.strokeStyle = dark ? '#567663' : '#777';
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

function formatGridValue(value: number, gap: number): string {
    // Determinar cuántos decimales mostrar basado en el gap
    if (gap >= 1) {
        return Math.round(value).toString();
    } else {
        // Contar decimales necesarios basado en el gap
        const gapStr = gap.toString();
        const decimalPart = gapStr.split('.')[1] || '';
        const decimals = decimalPart.length;
        return value.toFixed(decimals);
    }
}

function drawGridLabels(ctx: CanvasRenderingContext2D, dark: boolean): void {
    const plane = usePlaneStore.getState();
    const { width, height } = ctx.canvas;

    const [pX, pY] = [
        plane.position.x * plane.scale,
        plane.position.y * plane.scale * -1,
    ];

    // Calcular gap igual que en drawGrids
    const gap =
        width > height
            ? getGap(height, plane.scale)
            : getGap(width, plane.scale);

    // Configuración de texto
    ctx.fillStyle = dark ? '#ccc' : '#333';
    ctx.font = '12px Arial';
    ctx.textBaseline = 'middle';

    // Padding desde los bordes para el modo sticky
    const padding = 8;

    // Determinar posición sticky para labels del eje Y
    let yLabelX: number;
    if (pX >= 0 && pX <= width) {
        // Eje Y visible - labels junto al eje
        yLabelX = pX + padding;
    } else if (pX < 0) {
        // Estamos en cuadrante 1 o 4 - eje Y está a la izquierda
        yLabelX = padding;
    } else {
        // Estamos en cuadrante 2 o 3 - eje Y está a la derecha
        yLabelX = width - 40; // Espacio para el texto
    }

    // Determinar posición sticky para labels del eje X
    let xLabelY: number;
    if (pY >= 0 && pY <= height) {
        // Eje X visible - labels junto al eje
        xLabelY = pY + 15;
    } else if (pY < 0) {
        // Estamos en cuadrante 3 o 4 - eje X está arriba
        xLabelY = 15;
    } else {
        // Estamos en cuadrante 1 o 2 - eje X está abajo
        xLabelY = height - padding;
    }

    // Calcular posiciones de inicio para las líneas
    let startX = pX % gap;
    let startY = pY % gap;

    if (startX < 0) startX += gap;
    if (startY < 0) startY += gap;

    // Dibujar labels para líneas verticales (coordenadas X)
    for (let x = startX - gap; x <= width + gap; x += gap) {
        if (x >= 0 && x <= width) {
            // Calcular el valor real en coordenadas del plano
            const worldX = (x - pX) / plane.scale;

            // No dibujar el 0 en X si está muy cerca del eje Y
            if (Math.abs(worldX) < gap / plane.scale / 2) continue;

            const label = formatGridValue(worldX, gap / plane.scale);

            // Centrar el texto horizontalmente en la línea
            ctx.textAlign = 'center';
            ctx.fillText(label, x, xLabelY);
        }
    }

    // Dibujar labels para líneas horizontales (coordenadas Y)
    for (let y = startY - gap; y <= height + gap; y += gap) {
        if (y >= 0 && y <= height) {
            // Calcular el valor real en coordenadas del plano (invertir Y)
            const worldY = -(y - pY) / plane.scale;

            // No dibujar el 0 en Y si está muy cerca del eje X
            if (Math.abs(worldY) < gap / plane.scale / 2) continue;

            const label = formatGridValue(worldY, gap / plane.scale);

            // Alinear texto según la posición
            if (yLabelX < width / 2) {
                ctx.textAlign = 'left';
            } else {
                ctx.textAlign = 'right';
            }

            ctx.fillText(label, yLabelX, y);
        }
    }
}

export { drawGrids, drawGridLabels };
