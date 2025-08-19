import React, { memo, useEffect, useRef } from 'react';
import {
    useEntityStore,
    type EntityStore,
} from '@/simulations/cinematica/stores/useEntityStore';
import { Entity, EntityProps } from '@/simulations/cinematica/entities/Entity';
import { useURL } from '../../hooks/useURL';
import { compressData } from '../../utils/encodeAndDecodeEntities';

interface MagnitudeInputProps {
    className?: string;
    entityId: string;
    entityProp: 'position' | 'velocity' | 'acceleration';
    setError: React.Dispatch<React.SetStateAction<string>>;
}

const MagnitudeInput = memo(function MagnitudeInput({
    className,
    entityId,
    entityProp,
    setError,
}: MagnitudeInputProps) {
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
            const newValue = entity[entityProp].mag();
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
            .entities.find((e) => e.id === entityId)!;
        const initValue = initEntity[entityProp].mag();
        if (inputRef.current && initEntity) {
            if (initValue) {
                inputRef.current.value = initValue.toFixed(2);
            }
            previousRef.current = initValue;
        }

        return unsubscribe;
    }, [entityId]);

    // Actualizar store cuando el usuario modifica
    const updateX = useEntityStore((s) => s.updateSpecificPropOfEntity);
    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const n = Number(e.target.value);
        if (isNaN(n)) {
            e.target.value = previousRef.current.toString();
            setError(`${entityProp} solo puede ser un número`);
            return;
        }
        const cleaned = e.target.value
            .replace(/^0+(?=\d)/, '')
            .replace(/^0+$/, '');
        e.target.value = cleaned;
        previousRef.current = n;
        const vector = useEntityStore
            .getState()
            .entities.find((e) => e.id === entityId)![entityProp];
        vector.setMag(n);
        updateX(entityId, (entityProp + '.x') as any, vector.x);
        updateX(entityId, (entityProp + '.y') as any, vector.y);
        setError('');
    };
    const { setURLParams } = useURL();
    const onBlur = () => {
        setURLParams({
            d: compressData(useEntityStore.getState().entities),
        });
    };
    const onSubmit = (e: React.InputEvent<HTMLInputElement>) => {
        e.preventDefault();
        setURLParams({
            d: compressData(useEntityStore.getState().entities),
        });
    };

    return (
        <div className="w-full h-9 bg-[#2B3B31] rounded-md flex flex-1 flex-row p-2 gap-1 items-center justify-between cursor-pointer">
            <span className="text-[#89A996] w-3 h-5 text-sm font-mono">m</span>
            <input
                type="text"
                name="time"
                ref={inputRef}
                onChange={onChange}
                onBlur={onBlur}
                onSubmit={onSubmit}
                placeholder="0"
                className="flex grow w-full h-5 bg-transparet p-0 text-start text-sm text-[#D3DFD8] font-mono focus:outline-none"
            />
        </div>
    );
});

MagnitudeInput.displayName = 'MagnitudeInput';

export default MagnitudeInput;
