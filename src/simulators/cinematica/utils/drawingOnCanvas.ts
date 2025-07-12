import type { AbsolutePlaneState, CanvasConfig, Ticker } from '@/simulators/cinematica/types';

function drawGrid(
    $canvas: HTMLCanvasElement,
    AbsolutePlaneState: AbsolutePlaneState,
    CANVAS_CONFIG: CanvasConfig
): void {
    const ctx = $canvas.getContext('2d')!;

    const rect = $canvas.getBoundingClientRect();
    const gridSize = CANVAS_CONFIG.GRID_SIZE * AbsolutePlaneState.scale;

    if (gridSize < 10 || gridSize > rect.width / 2) return;

    const absolutePos = {
        x: AbsolutePlaneState.position.x * AbsolutePlaneState.scale,
        y: AbsolutePlaneState.position.y * AbsolutePlaneState.scale,
    };

    ctx.strokeStyle = '#789';
    ctx.lineWidth = 0.5;

    // Líneas verticales
    const startX = Math.floor(-absolutePos.x / gridSize) * gridSize;
    const endX = startX + Math.ceil(rect.width / gridSize + 1) * gridSize;

    for (let x = startX; x <= endX; x += gridSize) {
        const canvasX = absolutePos.x + x;
        if (canvasX >= 0 && canvasX <= rect.width) {
            ctx.beginPath();
            ctx.moveTo(canvasX, 0);
            ctx.lineTo(canvasX, rect.height);
            ctx.stroke();
        }
    }

    // Líneas horizontales
    const startY = Math.floor(-absolutePos.y / gridSize) * gridSize;
    const endY = startY + Math.ceil(rect.height / gridSize + 1) * gridSize;
    
    for (let y = startY; y <= endY; y += gridSize) {
        const canvasY = absolutePos.y + y;
        if (canvasY >= 0 && canvasY <= rect.height) {
            ctx.beginPath();
            ctx.moveTo(0, canvasY);
            ctx.lineTo(rect.width, canvasY);
            ctx.stroke();
        }
    }
}

function drawAxes(
    $canvas: HTMLCanvasElement,
    AbsolutePlaneState: AbsolutePlaneState
): void {
    const ctx = $canvas.getContext('2d')!;

    const rect = $canvas.getBoundingClientRect();
    const absolutePos = {
        x: AbsolutePlaneState.position.x * AbsolutePlaneState.scale,
        y: AbsolutePlaneState.position.y * AbsolutePlaneState.scale,
    };
    
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2;
    
    // Eje X
    if (absolutePos.y >= 0 && absolutePos.y <= rect.height) {
        ctx.beginPath();
        ctx.moveTo(0, absolutePos.y);
        ctx.lineTo(rect.width, absolutePos.y);
        ctx.stroke();
    }
    
    // Eje Y
    if (absolutePos.x >= 0 && absolutePos.x <= rect.width) {
        ctx.beginPath();
        ctx.moveTo(absolutePos.x, 0);
        ctx.lineTo(absolutePos.x, rect.height);
        ctx.stroke();
    }
    
    // Origen
    if (absolutePos.x >= -10 && absolutePos.x <= rect.width + 10 && 
        absolutePos.y >= -10 && absolutePos.y <= rect.height + 10) {
        ctx.beginPath();
        ctx.fillStyle = '#FFFFFF';
        ctx.arc(absolutePos.x, absolutePos.y, Math.max(4, AbsolutePlaneState.scale * 3), 0, Math.PI * 2);
        ctx.fill();
    }
};

function clearCanvas(
    $canvas: HTMLCanvasElement
): void {
    const ctx = $canvas.getContext('2d')!;

    ctx.clearRect(0, 0, $canvas.width, $canvas.height);
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, $canvas.width, $canvas.height);
}

function drawEntities(
    ctx: CanvasRenderingContext2D,
    entities: any[],
    AbsolutePlane: AbsolutePlaneState,
    Ticker: Ticker,
    speed: number,
    showVectors: boolean,
    isPlaying: boolean,
) {
    entities.forEach(entity => {
        if (isPlaying) {
            entity.update(Ticker.deltaTime * speed);
        }
        entity.absoluteMoveAndScale(AbsolutePlane.position, AbsolutePlane.scale);
        entity.draw(ctx);
        if (showVectors) {
            entity.drawVelocityVector(ctx, AbsolutePlane.scale);
            entity.drawAccelerationVector(ctx, AbsolutePlane.scale);
        }
    });
}

function drawPlane(
    $canvas: HTMLCanvasElement,
    AbsolutePlane: AbsolutePlaneState,
    CANVAS_CONFIG: CanvasConfig
): void {
    drawAxes($canvas, AbsolutePlane);
    drawGrid($canvas, AbsolutePlane, CANVAS_CONFIG);
}

export {
    drawPlane,
    clearCanvas,
    drawEntities,
};