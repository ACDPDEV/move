import React, { memo, useEffect, useRef } from 'react';
import {
    useTimeStore,
    type TimeStore,
} from '@/simulations/cinematica/store/useTimeStore';
import { Input } from '@/components/ui/input';

interface FPSBadgeProps {
    className?: string;
}

const FPSBadge = memo(function FPSBadge({
    className,
}: FPSBadgeProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const previousRef = useRef<number>(0);

    // Suscripción a TODO el estado, filtrar la propiedad que interesa
    useEffect(() => {
        // Función de actualización interna
        const subscriber = (state: TimeStore) => {
            const fps = state.fps
            if (!fps) return;

            const newValue: number = fps;
            const el = inputRef.current;
            // Actualiza solo si el input no está enfocado y cambió
            if (
                el &&
                document.activeElement !== el &&
                newValue !== previousRef.current
            ) {
                el.value = newValue.toFixed(0);
                previousRef.current = newValue;
            }
        };

        // Subscribe devuelve la función de unsubscribe
        const unsubscribe = useTimeStore.subscribe(subscriber);

        // Inicializa el valor
        const initFPS = useTimeStore
            .getState().fps
        if (inputRef.current && initFPS) {
            inputRef.current.value = initFPS.toFixed(0);
            previousRef.current = initFPS;
        }

        return unsubscribe;
    }, []);

    

    return (
        <Input
            type="number"
            name="radius"
            ref={inputRef}
            placeholder="1"
            className={className}
        />
    );
});

FPSBadge.displayName = 'FPSBadge';

export default FPSBadge;
