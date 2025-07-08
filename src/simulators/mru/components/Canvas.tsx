import { useRef, useEffect } from 'preact/hooks'
import type { JSX } from 'preact/jsx-runtime'
import { useSimulation } from '@/simulators/mru/context/SimulationContext'

interface Ticker {
    timeCount: number;
    lastTime: number;
    frameCount: number;
    fps: number;
    lastFpsUpdate: number;
    deltaMS: number;
    deltaTime: number;
}

interface MouseState {
    isDown: boolean;
    startPosition: { x: number, y: number };
    currentPosition: { x: number, y: number };
    deltaPosition: { x: number, y: number };
}

interface AbsolutePlaneState {
    position: { x: number, y: number };
    scale: number;
}

function resizeCanvas($canvas: HTMLCanvasElement): void {
  const { width, height } = $canvas.getBoundingClientRect();
  const ratio = window.devicePixelRatio || 1;

  if ($canvas.width !== width * ratio || $canvas.height !== height * ratio) {
    $canvas.width = width * ratio;
    $canvas.height = height * ratio;
    const ctx = $canvas.getContext('2d');
    ctx?.setTransform(1, 0, 0, 1, 0, 0);
    ctx?.scale(ratio, ratio);
  }
}

const CANVAS_CONFIG = {
    MIN_SCALE: 0.1,
    MAX_SCALE: 10,
    GRID_SIZE: 100,
    ZOOM_SENSITIVITY: 0.001,
    MAX_GRID_LINES: 50
};

function runTicker(
    ticker: Ticker,
    speed: number,
    isPlaying: boolean,
    updateFPS: (fps: number) => void,
    updateTime: (time: number) => void,
) {
    const now = performance.now();
    ticker.deltaMS = now - (ticker.lastTime || now - 16);
    ticker.lastTime = now;
    
    ticker.frameCount++;
    if (now - ticker.lastFpsUpdate > 1000) {
        ticker.fps = Math.round((ticker.frameCount * 1000) / (now - ticker.lastFpsUpdate));
        ticker.frameCount = 0;
        ticker.lastFpsUpdate = now;
    }
    
    ticker.deltaTime = 60 / ticker.fps * speed;

    if (isPlaying) {
        ticker.timeCount += ticker.deltaMS / 1000 * speed;
        updateTime(ticker.timeCount);
    }
    updateFPS(ticker.fps);
}



function Canvas(
    { style }: {
        style?: JSX.CSSProperties
    }
) {
  
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const tickerRef = useRef<Ticker>({
        timeCount: 0,
        lastTime: 0,
        frameCount: 0,
        fps: 0,
        lastFpsUpdate: 0,
        deltaMS: 0,
        deltaTime: 0,
    });
    const { state: { isPlaying, entities, speed, showVectors },
        updateFPS, updateTime } = useSimulation();
    const MouseRef = useRef<MouseState>({
        isDown: false,
        startPosition: { x: 0, y: 0 },
        currentPosition: { x: 0, y: 0 },
        deltaPosition: { x: 0, y: 0 },
    });
    const AbsolutePlaneRef = useRef<AbsolutePlaneState>({
        position: { x: 300, y: 300 },
        scale: 1,
    });
    const drawGrid = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
        const rect = canvas.getBoundingClientRect();
        const gridSize = CANVAS_CONFIG.GRID_SIZE * AbsolutePlaneRef.current.scale;
        
        if (gridSize < 10 || gridSize > rect.width / 2) return;
        
        const absolutePos = {
            x: AbsolutePlaneRef.current.position.x * AbsolutePlaneRef.current.scale,
            y: AbsolutePlaneRef.current.position.y * AbsolutePlaneRef.current.scale,
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
    };

    const drawAxes = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
        const rect = canvas.getBoundingClientRect();
        const absolutePos = {
            x: AbsolutePlaneRef.current.position.x * AbsolutePlaneRef.current.scale,
            y: AbsolutePlaneRef.current.position.y * AbsolutePlaneRef.current.scale,
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
            ctx.arc(absolutePos.x, absolutePos.y, Math.max(4, AbsolutePlaneRef.current.scale * 3), 0, Math.PI * 2);
            ctx.fill();
        }
    };

    useEffect(() => {
    
        const $canvas = canvasRef.current!
        const ctx = $canvas.getContext('2d')!
        const ticker = tickerRef.current;
        let animationFrameId: number

        const Mouse = MouseRef.current;
        const AbsolutePlane = AbsolutePlaneRef.current;

        const handleResize = () => resizeCanvas($canvas);
        handleResize();
        window.addEventListener('resize', handleResize);

        const handleMouseDown = (event: MouseEvent) => {
            Mouse.isDown = true;
            Mouse.startPosition = { x: event.offsetX, y: event.offsetY };
            Mouse.currentPosition = { x: event.offsetX, y: event.offsetY };
        };
        
        const handleMouseMove = (event: MouseEvent) => {
            if (!Mouse.isDown) return;
            
            const deltaX = event.offsetX - Mouse.currentPosition.x;
            const deltaY = event.offsetY - Mouse.currentPosition.y;
            
            Mouse.deltaPosition = { x: deltaX, y: deltaY };
            Mouse.currentPosition = { x: event.offsetX, y: event.offsetY };
            
            AbsolutePlane.position.x += deltaX / AbsolutePlane.scale;
            AbsolutePlane.position.y += deltaY / AbsolutePlane.scale;
        };
        
        const handleMouseUp = () => {
            Mouse.isDown = false;
            Mouse.deltaPosition = { x: 0, y: 0 };
        };
        
        const handleWheel = (event: WheelEvent) => {
            event.preventDefault();
            
            const zoomFactor = event.deltaY * CANVAS_CONFIG.ZOOM_SENSITIVITY;
            const newScale = Math.max(
                CANVAS_CONFIG.MIN_SCALE,
                Math.min(CANVAS_CONFIG.MAX_SCALE, AbsolutePlane.scale - zoomFactor)
            );
            
            AbsolutePlane.scale = newScale;
        };
        
        $canvas.addEventListener('mousedown', handleMouseDown);
        $canvas.addEventListener('mousemove', handleMouseMove);
        $canvas.addEventListener('mouseup', handleMouseUp);
        $canvas.addEventListener('wheel', handleWheel);

        const render = () => {
            runTicker(ticker, speed, isPlaying, updateFPS, updateTime);

            ctx.clearRect(0, 0, $canvas.width, $canvas.height);
            
            ctx.fillStyle = 'black';
            ctx.fillRect(0, 0, $canvas.width, $canvas.height);
            
            const absolutePositionWithScale = {
                x: AbsolutePlane.position.x * AbsolutePlane.scale,
                y: AbsolutePlane.position.y * AbsolutePlane.scale,
            };
            
            drawGrid(ctx, $canvas);
            drawAxes(ctx, $canvas);

            entities.forEach(entity => {
                if (isPlaying) {
                    entity.update(ticker.deltaTime);
                }
                entity.absoluteMoveAndScale(AbsolutePlane.position, AbsolutePlane.scale);
                entity.draw(ctx);
                if (showVectors) {
                    entity.drawVelocityVector(ctx, AbsolutePlane.scale);
                    entity.drawAccelerationVector(ctx, AbsolutePlane.scale);
                }
            });

            animationFrameId = window.requestAnimationFrame(render)
        }
        render()
        
        return () => {
            window.cancelAnimationFrame(animationFrameId)
            $canvas.removeEventListener('mouseup', handleMouseUp);
            $canvas.removeEventListener('mousemove', handleMouseMove);
            $canvas.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('resize', handleResize);
        }
    }, [isPlaying, speed, entities, updateFPS, updateTime, showVectors])
    
    return <canvas ref={canvasRef} style={style} />
}

export default Canvas
