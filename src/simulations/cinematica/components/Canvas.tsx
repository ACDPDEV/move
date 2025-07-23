'use client';
import React, { useEffect, useRef } from 'react';
import { useEntityUpdater } from '@/simulations/cinematica/hooks/useEntityUpdater';
import { useCanvasRenderer } from '@/simulations/cinematica/hooks/useCanvasRenderer';
import { useTimer } from '@/simulations/cinematica/hooks/useTimer';
import { usePlaneStore } from '@/simulations/cinematica/store/usePlaneStore';
import { listenEvents } from '@/simulations/cinematica/utils/canvasListeners';
import { CANVAS_CONFIG } from '@/simulations/cinematica/utils/canvasManagment';
import { MouseState } from '@/simulations/cinematica/types';

function Canvas({ style }: { style?: React.CSSProperties }) {
    useTimer(); // ⏱️ Hook que actualiza delta, fps, time, etc.
    useEntityUpdater(); // 🧠 Hook que actualiza las entidades

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const MouseRef = useRef<MouseState>({
        isDown: false,
        startPosition: { x: 0, y: 0 },
        currentPosition: { x: 0, y: 0 },
        deltaPosition: { x: 0, y: 0 },
    });

    const {
        plane: absolutePlane,
        setPosition,
        setScale,
    } = usePlaneStore.getState();
    useCanvasRenderer(canvasRef as React.RefObject<HTMLCanvasElement>); // 🎨 Dibuja plano y entidades

    useEffect(() => {
        if (!canvasRef.current) return;

        const cleanup = listenEvents(
            canvasRef.current,
            MouseRef.current,
            absolutePlane,
            CANVAS_CONFIG,
            setPosition,
            setScale,
        );

        return cleanup;
    }, [canvasRef, absolutePlane]);

    return <canvas ref={canvasRef} style={style} className="w-full h-full" />;
}

export default Canvas;
