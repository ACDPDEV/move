'use client';
import React, { memo, useEffect, useRef } from 'react';
import {
    useTimeStore,
    type TimeStore,
} from '@/simulations/cinematica/store/useTimeStore';

interface FPSBadgeProps {
    className?: string;
}

const FPSBadge = memo(function FPSBadge({ className }: FPSBadgeProps) {
    const spanRef = useRef<HTMLDivElement>(null);
    const previousRef = useRef<number>(0);

    useEffect(() => {
        const subscriber = (state: TimeStore) => {
            const fps = state.fps;
            if (!fps) return;

            const newValue = fps;
            const el = spanRef.current;

            if (el && newValue !== previousRef.current) {
                el.textContent = newValue.toFixed(0);
                previousRef.current = newValue;
            }
        };

        const unsubscribe = useTimeStore.subscribe(subscriber);

        const initFPS = useTimeStore.getState().fps;
        if (spanRef.current && initFPS) {
            spanRef.current.textContent = initFPS.toFixed(0);
            previousRef.current = initFPS;
        }

        return unsubscribe;
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
