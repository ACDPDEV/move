import React, { memo, useEffect, useRef } from 'react';
import {
    useEntityStore,
    type EntityStore,
} from '@/simulations/cinematica/store/useEntityStore';
import { Entity } from '@/simulations/cinematica/entities/Entity';

interface PositionXInputProps {
    entityId: string;
    setError: React.Dispatch<React.SetStateAction<string>>;
}

const PositionXInput = memo(function PositionXInput({
    entityId,
    setError,
}: PositionXInputProps) {
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
            const newValue: number = entity.position.x;
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
            inputRef.current.value = initEntity.position.x.toFixed(0);
            previousRef.current = initEntity.position.x;
        }

        return unsubscribe;
    }, [entityId]);

    // Actualizar store cuando el usuario modifica
    const updateX = useEntityStore((s) => s.updateSpecificPropOfEntity);
    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const n = Number(e.target.value);
        if (isNaN(n)) {
            e.target.value = previousRef.current.toString();
            setError('Posición X solo puede ser un número');
            return;
        }
        previousRef.current = n;
        updateX(entityId, 'position.x', n);
        console.log('updateX', entityId, n);
        console.log(
            useEntityStore.getState().entities.find((e) => e.id === entityId),
        );
    };

    return (
        <input
            type="number"
            name="positionX"
            ref={inputRef}
            onChange={onChange}
        />
    );
});

PositionXInput.displayName = 'PositionXInput';

export default PositionXInput;
