import { usePlaneStore } from '../store/usePlaneStore';

function drawGrids(ctx: CanvasRenderingContext2D, dark: boolean): void {
    const plane = usePlaneStore.getState();

    const { width, height } = ctx.canvas;
    const [pX, pY] = [
        plane.position.x * plane.scale,
        plane.position.y * plane.scale * -1,
    ];
    const gap = plane.gap * plane.scale;

    // Prevenir bucles infinitos
    if (gap <= 0.1) {
        console.log('DrawGrids - gap too small, returning');
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
