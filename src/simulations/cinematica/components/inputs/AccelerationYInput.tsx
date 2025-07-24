import React, { memo, useEffect, useRef } from 'react';
import {
    useEntityStore,
    type EntityStore,
} from '@/simulations/cinematica/store/useEntityStore';
import { Entity } from '@/simulations/cinematica/entities/Entity';
import { Input } from '@/components/ui/input';

interface AccelerationYInputProps {
    className?: string;
    entityId: string;
    setError: React.Dispatch<React.SetStateAction<string>>;
}

const AccelerationYInput = memo(function AccelerationYInput({
    className,
    entityId,
    setError,
}: AccelerationYInputProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const previousRef = useRef<number>(0);

    // Suscripción a TODO el estado, filtrar la propiedad que interesa
    useEffect(() => {
        // Función de actualización interna
        const subscriber = (state: EntityStore) => {
            const entity: Entity | undefined = state.entities.find(
                (e) => e.id === entityId,
            );
            if (!entity) return;
            const newValue: number = entity.acceleration.y;
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
        const unsubscribe = useEntityStore.subscribe(subscriber);

        // Inicializa el valor
        const initEntity = useEntityStore
            .getState()
            .entities.find((e) => e.id === entityId);
        if (inputRef.current && initEntity) {
            if (initEntity.acceleration.y) {
                inputRef.current.value = initEntity.acceleration.y.toFixed(0);
            }
            previousRef.current = initEntity.acceleration.y;
        }

        return unsubscribe;
    }, [entityId]);

    // Actualizar store cuando el usuario modifica
    const updateY = useEntityStore((s) => s.updateSpecificPropOfEntity);
    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const n = Number(e.target.value);
        if (isNaN(n)) {
            e.target.value = previousRef.current.toString();
            setError('Aceleración Y solo puede ser un número');
            return;
        }
        if (e.target.value.includes('.') || e.target.value.includes(',')) {
            e.target.value = previousRef.current
                ? previousRef.current.toString()
                : '';
            setError('Aceleración Y solo puede ser un entero');
            return;
        }
        const cleaned = e.target.value
            .replace(/^0+(?=\d)/, '')
            .replace(/^0+$/, '');
        e.target.value = cleaned;
        previousRef.current = n;
        updateY(entityId, 'acceleration.y', n);
        setError('');
    };

    return (
        <Input
            type="number"
            name="accelerationY"
            ref={inputRef}
            onChange={onChange}
            placeholder="0"
            className={className}
        />
    );
});

AccelerationYInput.displayName = 'AccelerationYInput';

export default AccelerationYInput;
