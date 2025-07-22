import { useEffect } from 'react';
import {
    drawPlane,
    clearCanvas,
    drawEntities,
} from '@/simulations/cinematica/utils/drawingOnCanvas';
import { usePlaneStore } from '../store/usePlaneStore';
import { CANVAS_CONFIG } from '../utils/canvasManagment';
import { useTimeStore } from '../store/useTimeStore';
import { useEntityStore } from '../store/useEntityStore';
import { useDisplayStore } from '../store/useDisplayStore';

function useCanvasRenderer(canvasRef: React.RefObject<HTMLCanvasElement>) {
    useEffect(() => {
        let animationFrameId: number;
        const $canvas = canvasRef.current;
        const ctx = $canvas?.getContext('2d');

        const loop = () => {
            const plane = usePlaneStore.getState().plane;
            const entities = useEntityStore.getState().entities;
            const deltaTime = useTimeStore.getState().delta;
            const speed = useTimeStore.getState().speed;
            const isPlaying = useTimeStore.getState().isPlaying;
            const displayOptions = useDisplayStore.getState();

            clearCanvas($canvas);
            drawPlane($canvas, plane, CANVAS_CONFIG);
            drawEntities(
                ctx!,
                entities,
                plane,
                deltaTime,
                speed,
                displayOptions,
                isPlaying,
            );

            animationFrameId = requestAnimationFrame(loop);
        };
        loop();

        return () => cancelAnimationFrame(animationFrameId);
    }, [canvasRef]);
}

export { useCanvasRenderer };
