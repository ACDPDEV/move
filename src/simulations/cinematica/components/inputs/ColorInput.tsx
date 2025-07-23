import React, { memo, useEffect, useRef } from 'react';
import {
    useEntityStore,
    type EntityStore,
} from '@/simulations/cinematica/store/useEntityStore';
import { Entity } from '@/simulations/cinematica/entities/Entity';
import { Input } from '@/components/ui/input';

interface ColorInputProps {
    className?: string;
    entityId: string;
    setError: React.Dispatch<React.SetStateAction<string>>;
}

const ColorInput = memo(function ColorInput({
    className,
    entityId,
    setError,
}: ColorInputProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const previousRef = useRef<string>('');

    // Suscripción a TODO el estado, filtrar la propiedad que interesa
    useEffect(() => {
        // Función de actualización interna
        const subscriber = (state: EntityStore) => {
            const entity: Entity | undefined = state.entities.find(
                (e) => e.id === entityId,
            );
            if (!entity) return;
            const newValue: string = entity.color;
            const el = inputRef.current;
            // Actualiza solo si el input no está enfocado y cambió
            if (
                el &&
                document.activeElement !== el &&
                newValue !== previousRef.current
            ) {
                el.value = newValue;
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
            inputRef.current.value = initEntity.color;
            previousRef.current = initEntity.color;
        }

        return unsubscribe;
    }, [entityId]);

    // Actualizar store cuando el usuario modifica
    const updateX = useEntityStore((s) => s.updateSpecificPropOfEntity);
    const onChange = (el: React.ChangeEvent<HTMLInputElement>) => {
        const color = el.target.value;
        previousRef.current = color;
        updateX(entityId, 'color', color);
        setError('');
    };

    return (
        <Input
            name="color"
            type="color"
            value={previousRef.current}
            onChange={onChange}
            ref={inputRef}
            className={className}
        />
    );
});

ColorInput.displayName = 'ColorInput';

export default ColorInput;
