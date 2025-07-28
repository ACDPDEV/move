'use client';
import React, { memo, useEffect, useRef } from 'react';
import { useTimeStore } from '@/simulations/cinematica/stores/useTimeStore';

interface FPSBadgeProps {
    className?: string;
}

const FPSBadge = memo(function FPSBadge({ className }: FPSBadgeProps) {
    const spanRef = useRef<HTMLDivElement>(null);
    const previousRef = useRef<number>(0);

    useEffect(() => {
        const updateFPS = () => {
            const fps = useTimeStore.getState().fps;
            if (!fps) return;

            const newValue = fps;
            const el = spanRef.current;
            if (el) {
                el.textContent = newValue.toFixed(0);
                previousRef.current = newValue;
            }
        };

        // Actualización inicial
        updateFPS();

        // Configurar intervalo para actualizar cada segundo
        const intervalId = setInterval(updateFPS, 1000);

        // Cleanup
        return () => {
            clearInterval(intervalId);
        };
    }, []);

    return (
        <div
            className={`px-4 py-1 border rounded text-sm text-center bg-stone-200 dark:bg-stone-800 w-fit justify-center items-center h-fit ${
                className ?? ''
            }`}
        >
            <span
                ref={spanRef}
                className="text-stone-500 dark:text-stone-400 justify-center items-center"
            >
                60
            </span>
            <span className="text-stone-500 dark:text-stone-400 justify-center items-center">
                {' '}
                FPS
            </span>
        </div>
    );
});

FPSBadge.displayName = 'FPSBadge';

export default FPSBadge;
