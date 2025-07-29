import React, { memo, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { TimeStore, useTimeStore } from '../../stores/useTimeStore';
import { useEntityStore } from '../../stores/useEntityStore';

interface TimeInputProps {
    className?: string;
    setError: React.Dispatch<React.SetStateAction<string>>;
}

const TimeInput = memo(function TimeInput({
    className,
    setError,
}: TimeInputProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const previousRef = useRef<number>(0);
    const isMovementPrediction = useTimeStore((s) => s.movementPrediction);

    // Suscripción a TODO el estado, filtrar la propiedad que interesa
    useEffect(() => {
        // Función de actualización interna
        const subscriber = (state: TimeStore) => {
            const time = state.time;
            const newValue: number = time;
            const el = inputRef.current;
            // Actualiza solo si el input no está enfocado y cambió
            if (
                el &&
                document.activeElement !== el &&
                newValue !== previousRef.current
            ) {
                if (newValue.toFixed(0) === '0') {
                    el.value = '';
                    return;
                } else {
                    el.value = newValue.toFixed(0);
                    previousRef.current = newValue;
                }
            }
        };

        // Subscribe devuelve la función de unsubscribe
        const unsubscribe = useTimeStore.subscribe(subscriber);

        // Inicializa el valor
        const initTime = useTimeStore.getState().time;
        if (inputRef.current && initTime) {
            if (initTime) {
                if (initTime.toFixed(0) === '0') {
                    inputRef.current.value = '';
                } else {
                    inputRef.current.value = initTime.toFixed(0);
                }
            }
            previousRef.current = initTime;
        }

        return unsubscribe;
    }, []);

    // Actualizar store cuando el usuario modifica
    const update = useTimeStore((s) => s.updateTime);
    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const n = Number(e.target.value);
        if (isNaN(n)) {
            e.target.value = previousRef.current.toString();
            setError('Tiempo solo puede ser un número');
            return;
        }
        if (e.target.value.includes('.') || e.target.value.includes(',')) {
            e.target.value = previousRef.current
                ? previousRef.current.toString()
                : '';
            setError('Tiempo solo puede ser un entero');
            return;
        }
        const cleaned = e.target.value
            .replace(/^0+(?=\d)/, '')
            .replace(/^0+$/, '');
        e.target.value = cleaned;
        previousRef.current = n;
        if (isMovementPrediction) {
            useEntityStore
                .getState()
                .updateAllEntities(
                    (n - useTimeStore.getState().time) *
                        useTimeStore.getState().speed,
                );
        }
        update(n);
        setError('');
    };

    return (
        <div className="relative w-full">
            <Input
                type="number"
                name="time"
                ref={inputRef}
                onChange={onChange}
                placeholder="0"
                className={`${className} w-28 pr-6`} // espacio a la derecha para la "s"
            />
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none select-none">
                s
            </span>
        </div>
    );
});

TimeInput.displayName = 'TimeInput';

export default TimeInput;
