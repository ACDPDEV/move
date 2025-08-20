import React, { memo, useEffect, useRef, useState } from 'react';
import {
    useEntityStore,
    type EntityStore,
} from '@/simulations/cinematica/stores/useEntityStore';
import { Entity } from '@/simulations/cinematica/entities/Entity';
import { useURL } from '../../hooks/useURL';
import { compressData } from '../../utils/encodeAndDecodeEntities';
import { Vector2D } from '@/simulations/lib/utils';

interface MagnitudeInputProps {
    className?: string;
    entityId: string;
    entityProp: 'position' | 'velocity' | 'acceleration';
    setError: React.Dispatch<React.SetStateAction<string>>;
}

/** Mismo fallback que en AngleInput (copiar/pegar para mantener archivos independientes) */
function fallbackUpdateEntityVector(
    entityId: string,
    entityProp: 'position' | 'velocity' | 'acceleration',
    newX: number,
    newY: number,
) {
    useEntityStore.setState((state) => {
        const idx = state.entities.findIndex((e) => e.id === entityId);
        if (idx === -1) return state;

        const orig = state.entities[idx];
        const newEntity: any = Object.create(Object.getPrototypeOf(orig));
        Object.assign(newEntity, orig);
        newEntity[entityProp] = new Vector2D(newX, newY);

        const newEntities = state.entities.slice();
        newEntities[idx] = newEntity;
        return { ...state, entities: newEntities };
    });
}

const MagnitudeInput = memo(function MagnitudeInput({
    className,
    entityId,
    entityProp,
    setError,
}: MagnitudeInputProps) {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [text, setText] = useState<string>('0');

    const updateSpecific = useEntityStore(
        (s) => (s as any).updateSpecificPropOfEntity,
    );
    const { setURLParams } = useURL();

    useEffect(() => {
        const state = useEntityStore.getState();
        const initEntity: Entity | undefined = state.entities.find(
            (e) => e.id === entityId,
        );
        if (initEntity) {
            const mag = initEntity[entityProp].mag();
            setText(Number(mag.toFixed(2)).toString());
        }

        const subscriber = (s: EntityStore) => {
            const ent = s.entities.find((e) => e.id === entityId);
            if (!ent) return;
            const newMag = ent[entityProp].mag();
            if (document.activeElement !== inputRef.current) {
                setText(Number(newMag.toFixed(2)).toString());
            }
        };

        const unsubscribe = useEntityStore.subscribe(subscriber);
        return unsubscribe;
    }, [entityId, entityProp]);

    const persistToURL = () => {
        setURLParams({
            d: compressData(useEntityStore.getState().entities),
        });
    };

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value;
        setText(raw);

        if (raw.trim() === '') return;

        const n = Number(raw);
        if (isNaN(n)) {
            setError(`${entityProp} solo puede ser un número`);
            return;
        }
        setError('');

        try {
            const state = useEntityStore.getState();
            const vector = state.entities.find((ent) => ent.id === entityId)![
                entityProp
            ];

            const angleRad = vector.angle();
            const newX = n * Math.cos(angleRad);
            const newY = n * Math.sin(angleRad);

            if (typeof updateSpecific === 'function') {
                try {
                    updateSpecific(entityId, `${entityProp}.x`, newX);
                    updateSpecific(entityId, `${entityProp}.y`, newY);
                    return;
                } catch (innerErr) {
                    console.warn('updateSpecificPropOfEntity falló:', innerErr);
                }
            }

            fallbackUpdateEntityVector(entityId, entityProp, newX, newY);
        } catch (err) {
            console.error(err);
            setError('No se pudo actualizar la entidad (ver consola).');
        }
    };

    const onBlur = () => {
        persistToURL();
    };

    const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            persistToURL();
            (e.target as HTMLInputElement).blur();
        }
    };

    return (
        <div
            className={`w-full h-9 bg-[#2B3B31] rounded-md flex flex-1 flex-row p-2 gap-1 items-center justify-between cursor-pointer ${
                className ?? ''
            }`}
        >
            <span className="text-[#89A996] w-3 h-5 text-sm font-mono">m</span>
            <input
                type="text"
                name="magnitude"
                ref={inputRef}
                value={text}
                onChange={onChange}
                onBlur={onBlur}
                onKeyDown={onKeyDown}
                placeholder="0"
                className="flex grow w-full h-5 bg-transparent p-0 text-start text-sm text-[#D3DFD8] font-mono focus:outline-none"
            />
        </div>
    );
});

MagnitudeInput.displayName = 'MagnitudeInput';

export default MagnitudeInput;
