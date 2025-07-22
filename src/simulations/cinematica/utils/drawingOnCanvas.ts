import type {
    AbsolutePlaneState,
    CanvasConfig,
} from '@/simulations/cinematica/types';
import type { DisplayOptions, Entity } from '../entities/Entity';

// Cache para optimización de cálculos repetitivos
const drawCache = {
    lastGridSize: 0,
    lastScale: 0,
    gridLines: { vertical: [] as number[], horizontal: [] as number[] },
    canvasRect: { width: 0, height: 0 },
};

function drawGrid(
    $canvas: HTMLCanvasElement,
    AbsolutePlaneState: AbsolutePlaneState,
    CANVAS_CONFIG: CanvasConfig,
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
        ctx.beginPath();
        ctx.moveTo(canvasX, 0);
        ctx.lineTo(canvasX, rect.height);
        ctx.stroke();
    }

    // Líneas horizontales
    const startY = Math.floor(-absolutePos.y / gridSize) * gridSize;
    const endY = startY + Math.ceil(rect.height / gridSize + 1) * gridSize;
    for (let y = startY; y <= endY; y += gridSize) {
        const canvasY = absolutePos.y + y;
        ctx.beginPath();
        ctx.moveTo(0, canvasY);
        ctx.lineTo(rect.width, canvasY);
        ctx.stroke();
    }
}

function drawAxes(
    $canvas: HTMLCanvasElement,
    AbsolutePlaneState: AbsolutePlaneState,
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
    if (
        absolutePos.x >= -10 &&
        absolutePos.x <= rect.width + 10 &&
        absolutePos.y >= -10 &&
        absolutePos.y <= rect.height + 10
    ) {
        ctx.beginPath();
        ctx.fillStyle = '#FFFFFF';
        ctx.arc(
            absolutePos.x,
            absolutePos.y,
            Math.max(4, AbsolutePlaneState.scale * 3),
            0,
            Math.PI * 2,
        );
        ctx.fill();
    }
}

function clearCanvas($canvas: HTMLCanvasElement): void {
    const ctx = $canvas.getContext('2d')!;
    ctx.clearRect(0, 0, $canvas.width, $canvas.height);
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, $canvas.width, $canvas.height);
}

function drawEntities(
    ctx: CanvasRenderingContext2D,
    entities: Entity[],
    AbsolutePlane: AbsolutePlaneState,
    deltaTime: number,
    speed: number,
    displayOptions: DisplayOptions,
    isPlaying: boolean,
): void {
    // --- Quitar culling: renderizamos todas las entidades aunque salgan del canvas ---
    // const visibleEntities = entities.filter(entity => {
    //   const margin = 100;
    //   return (
    //     entity.absolutePosition.x >= -margin &&
    //     entity.absolutePosition.x <= ctx.canvas.width + margin &&
    //     entity.absolutePosition.y >= -margin &&
    //     entity.absolutePosition.y <= ctx.canvas.height + margin
    //   );
    // });
    const visibleEntities = entities;

    visibleEntities.forEach((entity) => {
        if (isPlaying) {
            entity.update(deltaTime * speed);
        }
        entity.absoluteMoveAndScale(
            AbsolutePlane.position,
            AbsolutePlane.scale,
        );

        // Trayectorias
        if (displayOptions.trajectory) {
            entity.drawTrajectory?.(
                ctx,
                AbsolutePlane.position,
                AbsolutePlane.scale,
            );
        }
        // Entidad
        entity.draw(ctx);

        // Vectores
        const shouldDrawVectors =
            displayOptions.velocity.resultant ||
            displayOptions.velocity.components ||
            displayOptions.velocity.angle ||
            displayOptions.acceleration.resultant ||
            displayOptions.acceleration.components ||
            displayOptions.acceleration.angle ||
            displayOptions.position.resultant ||
            displayOptions.position.components ||
            displayOptions.position.angle;
        if (shouldDrawVectors) {
            entity.drawVectors?.(ctx, AbsolutePlane.scale, displayOptions);
        }

        // Coordenadas
        if (displayOptions.coordinates) {
            entity.drawCoordinates?.(ctx);
        }
    });
}

function drawPlane(
    $canvas: HTMLCanvasElement,
    AbsolutePlane: AbsolutePlaneState,
    CANVAS_CONFIG: CanvasConfig,
): void {
    drawAxes($canvas, AbsolutePlane);
    drawGrid($canvas, AbsolutePlane, CANVAS_CONFIG);
}

// Función para limpiar el cache cuando sea necesario
function clearDrawCache(): void {
    drawCache.lastGridSize = 0;
    drawCache.lastScale = 0;
    drawCache.gridLines = { vertical: [], horizontal: [] };
    drawCache.canvasRect = { width: 0, height: 0 };
}

// Función optimizada para dibujar información de debug
function drawDebugInfo(
    ctx: CanvasRenderingContext2D,
    entities: Entity[],
    fps: number,
    time: number,
): void {
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '14px monospace';
    ctx.textAlign = 'left';

    const debugLines = [
        `FPS: ${fps.toFixed(1)}`,
        `Time: ${time.toFixed(2)}s`,
        `Entities: ${entities.length}`,
    ];

    debugLines.forEach((line, index) => {
        ctx.fillText(line, 10, 20 + index * 20);
    });
}

export { drawPlane, clearCanvas, drawEntities, drawDebugInfo, clearDrawCache };
