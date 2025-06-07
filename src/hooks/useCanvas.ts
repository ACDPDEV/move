import { useEffect, useRef } from "preact/hooks";
import { resizeCanvas } from "@/lib/utils";

function useCanvas<T extends RenderingContext>(
    draw: (ctx: T, frameCount: number) => void,
    contextId: string,
    resize: boolean,
) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const ctx = canvas.getContext(contextId) as T;
        if (!ctx) return;
        
        let frameCount = 0;
        let animationFrameId: number;

        const render = () => {
            frameCount++
            if (resize && contextId === "2d") {
                resizeCanvas(canvas)
            }
            draw(ctx, frameCount)
            animationFrameId = window.requestAnimationFrame(render)
        }
        render()

        return () => {
            window.cancelAnimationFrame(animationFrameId)
        }
    }, [draw]);

    return canvasRef;
}

export { useCanvas };