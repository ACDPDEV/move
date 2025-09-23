import React, { memo, useEffect, useRef } from 'react';
import {
    useEntityStore,
    type EntityStore,
} from '@/simulations/cinematica/stores/useEntityStore';
import { Entity } from '@/simulations/cinematica/entities/Entity';
import { useURL } from '../../hooks/useURL';
import { compressData } from '../../utils/encodeAndDecodeEntities';
import Input from '@/components/ui/better-input';
import { usePlaneStore } from '../../stores/usePlaneStore';

interface RadiusInputProps {
    className?: string;
    entityId: string;
    setError: React.Dispatch<React.SetStateAction<string>>;
}

const RadiusInput = memo(function RadiusInput({
    className,
    entityId,
    setError,
}: RadiusInputProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const previousRef = useRef<number>(0);
    const gap = usePlaneStore((s) => s.gap);

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
                el.value = newValue.toFixed(2);
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
            inputRef.current.value = initEntity.radius.toFixed(2);
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
        if (n <= 0 && e.target.value !== '') {
            e.target.value = previousRef.current.toString();
            setError('Radio solo puede ser un número mayor 0');
            return;
        }
        const cleaned = e.target.value
            .replace(/^0+(?=\d)/, '')
            .replace(/^0+$/, '');
        e.target.value = cleaned;
        if (cleaned !== '') {
            previousRef.current = n;
            updateX(entityId, 'radius', n);
        }
        setError('');
    };
    const { setURLParams } = useURL();
    const onBlur = () => {
        setURLParams({
            d: compressData(useEntityStore.getState().entities),
        });
    };

    return (
        <Input
            ref={inputRef}
            name="radius"
            type="number"
            textPrefix="r"
            className="flex grow"
            placeholder="0"
            onChange={onChange}
            onBlur={onBlur}
            step={gap / 10}
        />
    );
});

RadiusInput.displayName = 'RadiusInput';

export default RadiusInput;
