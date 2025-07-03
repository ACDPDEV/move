import { useRef, useCallback } from 'preact/hooks';
import type { Movil } from '../entities/Movil';

function useDraw(
    updateFPS: (fps: number) => void,
    entities: Movil[],
    updateTime: (time: number) => void,
    speed: number,
    isPlaying: boolean
) {
    
    const lastTimeRef = useRef<number>(0);
    const counterRef = useRef<number>(0);
    const fpsRef = useRef<number>(0);
    const frameCountRef = useRef<number>(0);
    const lastFpsUpdateRef = useRef<number>(0);

    return useCallback((ctx: CanvasRenderingContext2D, frameCount: number) => {
        const canvas = ctx.canvas;
        const now = performance.now();
        const deltaMS = now - (lastTimeRef.current || now - 16);
        lastTimeRef.current = now;
        
        frameCountRef.current++;
        if (now - lastFpsUpdateRef.current > 1000) {
            fpsRef.current = Math.round((frameCountRef.current * 1000) / (now - lastFpsUpdateRef.current));
            frameCountRef.current = 0;
            lastFpsUpdateRef.current = now;
        }
        
        const deltaTime = fpsRef.current / 60 * speed;

        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        if (isPlaying) {
            counterRef.current += deltaMS / 1000 * speed;
            updateTime(counterRef.current);
        }
        updateFPS(fpsRef.current);

        entities.forEach(entity => {
            if (isPlaying) {
                entity.update(deltaTime);
            }
            entity.draw(ctx);
        });
    }, [updateFPS, updateTime, entities, speed, isPlaying]);
}

export { useDraw };
