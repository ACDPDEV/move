import { useCanvas } from "@/hooks/useCanvas";

function Canvas<T extends RenderingContext>(
    { draw, contextId = "2d", resize = false, ...props }: {
        draw: (ctx: T, frameCount: number) => void,
        contextId?: string
        resize?: boolean
    }
) {
    const canvasRef = useCanvas<T>(draw, contextId, resize);

    return <canvas class="w-full h-full" ref={canvasRef} {...props} />;
}

export { Canvas };