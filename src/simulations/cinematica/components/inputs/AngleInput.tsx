import React, { memo, useEffect, useRef, useState } from 'react';
import {
    useEntityStore,
    type EntityStore,
} from '@/simulations/cinematica/stores/useEntityStore';
import { Entity } from '@/simulations/cinematica/entities/Entity';
import { useURL } from '../../hooks/useURL';
import { compressData } from '../../utils/encodeAndDecodeEntities';
import { Vector2D } from '@/simulations/lib/utils';

interface AngleInputProps {
    className?: string;
    entityId: string;
    entityProp: 'position' | 'velocity' | 'acceleration';
    setError: React.Dispatch<React.SetStateAction<string>>;
}

const degToRad = (d: number) => (d * Math.PI) / 180;

/**
 * Fallback seguro: reemplaza la entidad en el estado con nueva referencia
 * y asigna un Vector2D nuevo en `entityProp`.
 */
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

const AngleInput = memo(function AngleInput({
    className,
    entityId,
    entityProp,
    setError,
}: AngleInputProps) {
    const inputRef = useRef<HTMLInputElement | null>(null);
    // controlled as string to allow intermediate empty or partial input
    const [text, setText] = useState<string>('0');

    const updateSpecific = useEntityStore(
        (s) => (s as any).updateSpecificPropOfEntity,
    );

    const { setURLParams } = useURL();

    // Inicialización + suscripción al store
    useEffect(() => {
        const state = useEntityStore.getState();
        const initEntity: Entity | undefined = state.entities.find(
            (e) => e.id === entityId,
        );
        if (initEntity) {
            const deg = (initEntity[entityProp].angle() * 180) / Math.PI;
            setText(Number(deg.toFixed(2)).toString());
        }

        const subscriber = (s: EntityStore) => {
            const ent = s.entities.find((e) => e.id === entityId);
            if (!ent) return;
            const newDeg = (ent[entityProp].angle() * 180) / Math.PI;
            // solo actualizar si no está enfocado para no interferir con edición
            if (document.activeElement !== inputRef.current) {
                setText(Number(newDeg.toFixed(2)).toString());
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
        // permitir que el usuario borre para escribir
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
            const mag = vector.mag();

            const angleRad = degToRad(n);
            const newX = mag * Math.cos(angleRad);
            const newY = mag * Math.sin(angleRad);

            // intentar la función del store si existe
            if (typeof updateSpecific === 'function') {
                try {
                    updateSpecific(entityId, `${entityProp}.x`, newX);
                    updateSpecific(entityId, `${entityProp}.y`, newY);
                    return;
                } catch (innerErr) {
                    console.warn('updateSpecificPropOfEntity falló:', innerErr);
                    // cae al fallback
                }
            }

            // fallback seguro
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
            <span className="text-[#89A996] w-3 h-5 text-[10px] font-mono flex items-center">
                θ
            </span>
            <input
                type="text"
                name="angle"
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

AngleInput.displayName = 'AngleInput';

export default AngleInput;
