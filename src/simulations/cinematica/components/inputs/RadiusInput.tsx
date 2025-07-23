import React, { memo, useEffect, useRef } from 'react';
import {
    useEntityStore,
    type EntityStore,
} from '@/simulations/cinematica/store/useEntityStore';
import { Entity } from '@/simulations/cinematica/entities/Entity';

interface RadiusInputProps {
    entityId: string;
    setError: React.Dispatch<React.SetStateAction<string>>;
}

const RadiusInput = memo(function RadiusInput({
    entityId,
    setError,
}: RadiusInputProps) {
    console.log('render radius');
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
            const newValue: number = entity.radius;
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
            inputRef.current.value = initEntity.radius.toFixed(0);
            previousRef.current = initEntity.radius;
        }

        return unsubscribe;
    }, [entityId]);

    // Actualizar store cuando el usuario modifica
    const updateX = useEntityStore((s) => s.updateSpecificPropOfEntity);
    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const n = Number(e.target.value);
        if (isNaN(n)) {
            e.target.value = previousRef.current.toString();
            setError('Radio solo puede ser un número');
            return;
        }
        if (n <= 0) {
            e.target.value = previousRef.current.toString();
            setError('Radio solo puede ser un número mayor 0');
            return;
        }
        previousRef.current = n;
        updateX(entityId, 'radius', n);
    };

    return (
        <input type="number" name="radius" ref={inputRef} onChange={onChange} />
    );
});

RadiusInput.displayName = 'RadiusInput';

export default RadiusInput;
