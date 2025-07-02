import { useRef, useCallback } from 'preact/hooks';
import type { Movil } from '../entities/Movil';

function useDraw(
    updateFPS: (fps: number) => void,
    updateEntities: (entities: Movil[]) => void,
    updateTime: (time: number) => void
) {
    
    const lastTimeRef = useRef<number>(0);
    const counterRef = useRef<number>(0);
    const fpsRef = useRef<number>(0);
    const frameCountRef = useRef<number>(0);
    const lastFpsUpdateRef = useRef<number>(0);

    return useCallback((ctx: CanvasRenderingContext2D, frameCount: number) => {
        const canvas = ctx.canvas;
        const now = performance.now();
        const deltaTime = now - (lastTimeRef.current || now - 16); 
        lastTimeRef.current = now;
        
        frameCountRef.current++;
        if (now - lastFpsUpdateRef.current > 1000) {
            fpsRef.current = Math.round((frameCountRef.current * 1000) / (now - lastFpsUpdateRef.current));
            frameCountRef.current = 0;
            lastFpsUpdateRef.current = now;
        }
        
        counterRef.current += deltaTime / 1000;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = 'white';
        ctx.font = '20px Arial';
        ctx.fillText(`Counter: ${counterRef.current.toFixed(2)}`, 20, 30);
        ctx.fillText(`FPS: ${fpsRef.current}`, 20, 60);
        ctx.fillText(`Delta: ${deltaTime.toFixed(2)}ms`, 20, 90);

        updateFPS(fpsRef.current);
        updateTime(counterRef.current);
    }, []);
}

export { useDraw };
