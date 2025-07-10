import { useRef } from 'preact/hooks';
import { useSimulation } from '@/simulators/cinematica/context/SimulationContext';
import type { Ticker, MouseState, AbsolutePlaneState } from '@/simulators/cinematica/types';

function useInitialRefs() {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const TickerRef = useRef<Ticker>({
        timeCount: 0,
        lastTime: 0,
        frameCount: 0,
        fps: 0,
        lastFpsUpdate: 0,
        deltaMS: 0,
        deltaTime: 0,
    });
    
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

    return {
        canvasRef,
        TickerRef,
        MouseRef,
        AbsolutePlaneRef,
    }
}

export { useInitialRefs }