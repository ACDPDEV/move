import { Application, Assets, Container, Sprite } from 'pixi.js';
import { useEffect, useRef } from 'preact/hooks';

function Canvas(
    { preload, setup, loop }: {
        preload: () => Promise<void>,
        setup: (app: Application, canvas: HTMLCanvasElement, container: HTMLDivElement) => Promise<void>
        loop: (app: Application) => void
    }
){
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const app = new Application();
        (async () => {
            try {
                await setup(app, canvasRef.current, containerRef.current);
                await preload();
                loop(app);
            } catch (error) {
                console.error('Error creating PixiJS application:', error);
            }
        })();
    }, []);

    return (
        <div ref={containerRef} class="w-full h-full">
            <canvas ref={canvasRef} />
        </div>
    );
}

export { Canvas };