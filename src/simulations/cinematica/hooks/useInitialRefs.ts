import { useRef } from 'react';
import type { Ticker, MouseState, AbsolutePlaneState } from '@/simulations/cinematica/types';
import { useSimulationStore } from '../store/useSimulationStore';

function useInitialRefs() {
    const { time, plane } = useSimulationStore();
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const TickerRef = useRef<Ticker>({
        timeCount: time,
        lastTime: 0,
        frameCount: 0,
        fps: 0,
        lastFpsUpdate: 0,
        deltaTime: 0,
    });
    
    const MouseRef = useRef<MouseState>({
        isDown: false,
        startPosition: { x: 0, y: 0 },
        currentPosition: { x: 0, y: 0 },
        deltaPosition: { x: 0, y: 0 },
    });
    const AbsolutePlaneRef = useRef<AbsolutePlaneState>({
        position: { x: plane.position.x, y: plane.position.y },
        scale: plane.scale,
    });

    return {
        canvasRef,
        TickerRef,
        MouseRef,
        AbsolutePlaneRef,
    }
}

export { useInitialRefs }