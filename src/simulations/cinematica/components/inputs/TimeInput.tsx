import React, { memo, useEffect, useRef } from 'react';
import { TimeStore, useTimeStore } from '../../stores/useTimeStore';
import { useEntityStore } from '../../stores/useEntityStore';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';

interface TimeInputProps {
    setError: React.Dispatch<React.SetStateAction<string>>;
}

const TimeInput = memo(function TimeInput({ setError }: TimeInputProps) {
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
                if (newValue.toFixed(2) === '0') {
                    el.value = '';
                    return;
                } else {
                    el.value = newValue.toFixed(2);
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
                if (initTime.toFixed(2) === '0') {
                    inputRef.current.value = '';
                } else {
                    inputRef.current.value = initTime.toFixed(2);
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
        if (isNaN(n) && e.target.value !== '' && e.target.value !== '.') {
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
        <Tooltip>
            <TooltipTrigger asChild>
                <div className="w-32 h-9 bg-[#2B3B31] rounded-md flex flex-row p-2 gap-1 items-center justify-between cursor-pointer">
                    <span className="text-[#89A996] w-3 h-5 text-sm font-mono">
                        t
                    </span>
                    <input
                        type="number"
                        name="time"
                        ref={inputRef}
                        onChange={onChange}
                        placeholder="0"
                        className="w-19 h-5 bg-transparet p-0 text-start text-sm text-[#D3DFD8] font-mono focus:outline-none"
                    />
                    <span className="text-[#567663] w-3 h-5 text-sm font-mono">
                        s
                    </span>
                </div>
            </TooltipTrigger>
            <TooltipContent>Tiempo</TooltipContent>
        </Tooltip>
    );
});

TimeInput.displayName = 'TimeInput';

export default TimeInput;
