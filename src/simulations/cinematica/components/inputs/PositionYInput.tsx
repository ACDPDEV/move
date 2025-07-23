import React, { memo, useEffect, useRef } from 'react';
import {
    useEntityStore,
    type EntityStore,
} from '@/simulations/cinematica/store/useEntityStore';
import { Entity } from '@/simulations/cinematica/entities/Entity';

interface PositionYInputProps {
    entityId: string;
}

const PositionYInput = memo(function PositionYInput({
    entityId,
}: PositionYInputProps) {
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
            const newValue: number = entity.position.y;
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
            inputRef.current.value = initEntity.position.y.toFixed(0);
            previousRef.current = initEntity.position.y;
        }

        return unsubscribe;
    }, [entityId]);

    // Actualizar store cuando el usuario modifica
    const updateY = useEntityStore((s) => s.updateSpecificPropOfEntity);
    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const n = Number(e.target.value);
        if (isNaN(n)) {
            e.target.value = previousRef.current.toString();
            return;
        }
        previousRef.current = n;
        updateY(entityId, 'position.y', n);
    };

    return (
        <input
            type="number"
            name="positionY"
            ref={inputRef}
            onChange={onChange}
        />
    );
});

PositionYInput.displayName = 'PositionYInput';

export default PositionYInput;
