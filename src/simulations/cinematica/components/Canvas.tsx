'use client';
import React, { useEffect, useRef, useCallback } from 'react';
import { listenEvents } from '@/simulations/cinematica/utils/canvasListeners';
import { useTimeStore } from '../stores/useTimeStore';
import { useEntityStore } from '../stores/useEntityStore';
import { useTheme } from 'next-themes';
import { drawOriginPoint } from '../draws/drawOriginPoint';
import { drawAxes } from '../draws/drawAxes';
import { drawEntities } from '../draws/drawEntities';
import { drawGrids } from '../draws/drawGrids';

interface CanvasProps {
    style?: React.CSSProperties;
    className?: string;
}

function Canvas({ style, className }: CanvasProps) {
    const animationIdRef = useRef<number | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { theme } = useTheme();

    // Loop principal de renderizado
    const renderLoop = useCallback(() => {
        // Actualizar tiempo
        useTimeStore.getState().runLoopTime();

        // Actualizar entidades si la simulación está corriendo
        if (useTimeStore.getState().isPlaying) {
            useEntityStore
                .getState()
                .updateAllEntities(
                    useTimeStore.getState().delta *
                        useTimeStore.getState().speed,
                );
        }

        // Obtener referencias del canvas
        const canvas = canvasRef.current;
        if (!canvas) {
            animationIdRef.current = requestAnimationFrame(renderLoop);
            return;
        }

        const ctx = canvas.getContext('2d');
        if (!ctx) {
            animationIdRef.current = requestAnimationFrame(renderLoop);
            return;
        }
        const { width, height } = canvas;

        // Limpiar canvas
        ctx.clearRect(0, 0, width, height);

        drawGrids(ctx, theme === 'dark');
        drawOriginPoint(ctx, theme === 'dark');
        drawAxes(ctx, theme === 'dark');
        drawEntities(ctx);

        // Continuar el loop
        animationIdRef.current = requestAnimationFrame(renderLoop);
    }, [theme]);

    // Efecto para el loop de renderizado
    useEffect(() => {
        animationIdRef.current = requestAnimationFrame(renderLoop);

        return () => {
            if (animationIdRef.current !== null) {
                cancelAnimationFrame(animationIdRef.current);
                animationIdRef.current = null;
            }
        };
    }, [renderLoop]);

    // Efecto para los event listeners
    useEffect(() => {
        if (!canvasRef.current) return;

        const cleanup = listenEvents(canvasRef.current);
        return cleanup;
    }, []);

    return <canvas ref={canvasRef} style={style} className={className} />;
}

export default Canvas;
