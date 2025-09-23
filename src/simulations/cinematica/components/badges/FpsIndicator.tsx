'use client';
import React, { memo, useEffect, useRef } from 'react';
import { useTimeStore } from '@/simulations/cinematica/stores/useTimeStore';

interface FPSBadgeProps {
    className?: string;
    interval?: number;
}

const FPSBadge = memo(function FPSBadge({
    className = 'px-4 py-1 rounded text-sm text-center bg-dark-green-900 shadow-md shadow-dark-green-950 w-fit justify-center items-center h-fit',
    interval = 3000,
}: FPSBadgeProps) {
    const spanRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const updateFPS = () => {
            const fps = useTimeStore.getState().fps;
            const badgeValue = spanRef.current;

            if (!fps || !badgeValue) return;

            badgeValue.textContent = fps.toFixed(0);
        };

        updateFPS();

        const intervalId = setInterval(updateFPS, interval);

        return () => {
            clearInterval(intervalId);
        };
    }, [interval]);

    return (
        <div className={className}>
            <span
                ref={spanRef}
                className="text-dark-green-500 justify-center items-center"
            >
                60
            </span>
            <span className="text-dark-green-500 justify-center items-center">
                {' '}
                FPS
            </span>
        </div>
    );
});

FPSBadge.displayName = 'FPSBadge';

export default FPSBadge;
