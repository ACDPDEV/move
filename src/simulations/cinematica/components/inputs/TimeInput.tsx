import React, { memo, useEffect, useRef } from 'react';
import Input from '@/simulations/cinematica/components/ui/input';
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
        <Input
            prefix="t"
            suffix="s"
            tooltip="Tiempo"
            onChange={onChange}
            value={previousRef.current}
            type="text"
            name="time"
            ref={inputRef}
        />
    );
});

TimeInput.displayName = 'TimeInput';

export default TimeInput;
