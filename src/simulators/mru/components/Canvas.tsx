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
    const { state: { isPlaying, entities, speed },
        updateFPS, updateTime } = useSimulation();
    const MouseRef = useRef<MouseState>({
        isDown: false,
        startPosition: { x: 0, y: 0 },
        currentPosition: { x: 0, y: 0 },
        deltaPosition: { x: 0, y: 0 },
    });
    const AbsolutePlaneRef = useRef<AbsolutePlaneState>({
        position: { x: 0, y: 0 },
        scale: 1,
    });

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
            Mouse.deltaPosition = {
                x: event.offsetX - Mouse.currentPosition.x,
                y: event.offsetY - Mouse.currentPosition.y,
            };
            Mouse.currentPosition = { x: event.offsetX, y: event.offsetY };
            AbsolutePlane.position.x += Mouse.deltaPosition.x;
            AbsolutePlane.position.y += Mouse.deltaPosition.y;

            console.log('Mouse: ', Mouse.deltaPosition);
            console.log('PlaneRelativePosition: ', AbsolutePlane);
        };
        const handleMouseUp = (event: MouseEvent) => {
            Mouse.isDown = false;
            Mouse.deltaPosition = { x: 0, y: 0 };
            Mouse.startPosition = { x: 0, y: 0 };
            Mouse.currentPosition = { x: 0, y: 0 };
            console.log('Mouse Up: ', AbsolutePlane);
        };
        const handleScroll = (event: WheelEvent) => {
            AbsolutePlane.scale += event.deltaY / 100;
            console.log('PlaneAbsolute: ', AbsolutePlane);
        };
        $canvas.addEventListener('mousedown', handleMouseDown);
        $canvas.addEventListener('mousemove', handleMouseMove);
        $canvas.addEventListener('mouseup', handleMouseUp);
        $canvas.addEventListener('wheel', handleScroll);

        const render = () => {
            runTicker(ticker, speed, isPlaying, updateFPS, updateTime);

            ctx.clearRect(0, 0, $canvas.width, $canvas.height);
            
            ctx.fillStyle = 'black';
            ctx.fillRect(0, 0, $canvas.width, $canvas.height);
            
            const absolutePositionWithScale = {
                x: AbsolutePlane.position.x * AbsolutePlane.scale,
                y: AbsolutePlane.position.y * AbsolutePlane.scale,
            };
            
            // (0, 0) origen del plano
            ctx.beginPath();
            ctx.fillStyle = '#FFFFFF';
            ctx.arc(absolutePositionWithScale.x, absolutePositionWithScale.y, AbsolutePlane.scale * 2, 0, Math.PI * 2);
            ctx.fill();

            // eje x
            ctx.beginPath();
            ctx.moveTo(0, absolutePositionWithScale.y);
            ctx.lineTo($canvas.width, absolutePositionWithScale.y);
            ctx.strokeStyle = '#FFFFFF';
            ctx.lineWidth = 1;
            ctx.stroke();

            // eje y
            ctx.beginPath();
            ctx.moveTo(absolutePositionWithScale.x, 0);
            ctx.lineTo(absolutePositionWithScale.x, $canvas.height);
            ctx.strokeStyle = '#FFFFFF';
            ctx.lineWidth = 1;
            ctx.stroke();

            // paralelas al eje x cada 100u
            for (let i = 0; i < $canvas.height; i += AbsolutePlane.scale * 100) {
                ctx.beginPath();
                ctx.moveTo(0, absolutePositionWithScale.y + i);
                ctx.lineTo($canvas.width, absolutePositionWithScale.y + i);
                ctx.strokeStyle = '#FFFFFF';
                ctx.lineWidth = 0.5;
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(0, absolutePositionWithScale.y - i);
                ctx.lineTo($canvas.width, absolutePositionWithScale.y - i);
                ctx.strokeStyle = '#FFFFFF';
                ctx.lineWidth = 0.5;
                ctx.stroke();
            }
            // paralelas al eje y cada 100u
            for (let i = 0; i < $canvas.width; i += AbsolutePlane.scale * 100) {
                ctx.beginPath();
                ctx.moveTo(absolutePositionWithScale.x + i, 0);
                ctx.lineTo(absolutePositionWithScale.x + i, $canvas.height);
                ctx.strokeStyle = '#FFFFFF';
                ctx.lineWidth = 0.5;
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(absolutePositionWithScale.x - i, 0);
                ctx.lineTo(absolutePositionWithScale.x - i, $canvas.height);
                ctx.strokeStyle = '#FFFFFF';
                ctx.lineWidth = 0.5;
                ctx.stroke();
            }

            entities.forEach(entity => {
                if (isPlaying) {
                    entity.update(ticker.deltaTime);
                }
                entity.absoluteMoveAndScale(AbsolutePlane.position, AbsolutePlane.scale);
                entity.draw(ctx);
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
    }, [isPlaying, speed, entities, updateFPS, updateTime])
    
    return <canvas ref={canvasRef} style={style} />
}

export default Canvas
