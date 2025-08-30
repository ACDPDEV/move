import Input from '@/simulations/cinematica/components/ui/input';
import Button from '@/simulations/cinematica/components/ui/button';
import VectorLetterIcon from '../svgs/VectorSymbol';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import {
    useEntityStore,
    type EntityStore,
} from '@/simulations/cinematica/stores/useEntityStore';
import { Entity } from '@/simulations/cinematica/entities/Entity';
import { useURL } from '../../hooks/useURL';
import { compressData } from '../../utils/encodeAndDecodeEntities';
import styles from '../../consts/styles';
import { formatClean } from '../../utils/formatClean';
import { usePlaneStore } from '../../stores/usePlaneStore';

const VectorInput = memo(function VectorInput({
    entityId,
    entityProp,
    setError,
}: {
    entityId: string;
    entityProp: 'position' | 'velocity' | 'acceleration';
    setError: (error: string) => void;
}) {
    const [mode, setMode] = useState<'cartesian' | 'polar'>('cartesian');
    const inputXRef = useRef<HTMLInputElement>(null);
    const inputYRef = useRef<HTMLInputElement>(null);
    const inputAngleRef = useRef<HTMLInputElement>(null);
    const inputMagnitudeRef = useRef<HTMLInputElement>(null);
    const previousRef = useRef<{
        x: number;
        y: number;
        angle: number;
        magnitude: number;
    }>({ x: 0, y: 0, angle: 0, magnitude: 0 });
    const [focus, setFocus] = useState({
        x: false,
        y: false,
        angle: false,
        magnitude: false,
    });
    const gap = usePlaneStore((s) => s.gap);
    const { setURLParams } = useURL();

    const isValidNumber = (value: string): boolean => {
        const num = parseFloat(value);
        return !isNaN(num) && isFinite(num);
    };

    const getCurrentEntity = useCallback((): Entity | undefined => {
        return useEntityStore
            .getState()
            .entities.find((e) => e.id === entityId);
    }, [entityId]);

    useEffect(() => {
        const entity = getCurrentEntity();
        if (!entity) return;

        const prop = entity[entityProp];
        if (!prop) return;

        const x = prop.x ?? 0;
        const y = prop.y ?? 0;
        const angle = typeof prop.angle === 'function' ? prop.angle() : 0;
        const magnitude = typeof prop.mag === 'function' ? prop.mag() : 0;

        if (inputXRef.current && !focus.x) {
            inputXRef.current.value = formatClean(x);
            previousRef.current.x = x;
        }
        if (inputYRef.current && !focus.y) {
            inputYRef.current.value = formatClean(y);
            previousRef.current.y = y;
        }
        if (inputAngleRef.current && !focus.angle) {
            inputAngleRef.current.value = formatClean(angle);
            previousRef.current.angle = angle;
        }
        if (inputMagnitudeRef.current && !focus.magnitude) {
            inputMagnitudeRef.current.value = formatClean(magnitude);
            previousRef.current.magnitude = magnitude;
        }
    }, [entityId, entityProp, mode, focus, getCurrentEntity]);

    useEffect(() => {
        const subscriber = (state: EntityStore) => {
            const entity: Entity | undefined = state.entities.find(
                (e) => e.id === entityId,
            );
            if (!entity) return;

            const prop = entity[entityProp];
            if (!prop) return;

            if (mode === 'cartesian') {
                if (inputXRef.current && !focus.x) {
                    const x = prop.x ?? 0;
                    inputXRef.current.value = formatClean(x);
                    previousRef.current.x = x;
                }
                if (inputYRef.current && !focus.y) {
                    const y = prop.y ?? 0;
                    inputYRef.current.value = formatClean(y);
                    previousRef.current.y = y;
                }
            } else if (mode === 'polar') {
                if (inputAngleRef.current && !focus.angle) {
                    const angle =
                        typeof prop.angle === 'function' ? prop.angle() : 0;
                    inputAngleRef.current.value = formatClean(angle);
                    previousRef.current.angle = angle;
                }
                if (inputMagnitudeRef.current && !focus.magnitude) {
                    const magnitude =
                        typeof prop.mag === 'function' ? prop.mag() : 0;
                    inputMagnitudeRef.current.value = formatClean(magnitude);
                    previousRef.current.magnitude = magnitude;
                }
            }
        };

        const unsubscribe = useEntityStore.subscribe(subscriber);
        return unsubscribe;
    }, [entityId, entityProp, mode, focus]);

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        const { name } = e.target;
        setFocus((prev) => ({ ...prev, [name]: true }));
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const { name } = e.target;
        setFocus((prev) => ({ ...prev, [name]: false }));

        try {
            const entities = useEntityStore.getState().entities;
            setURLParams({ d: compressData(entities) });
        } catch (error) {
            console.error('Error updating URL params:', error);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { target } = e;
        const { name, value } = target;

        if (!['x', 'y', 'angle', 'magnitude'].includes(name)) {
            return;
        }

        if (value === '' || value === '-') {
            return;
        }

        if (!isValidNumber(value)) {
            target.value = formatClean(
                previousRef.current[name as keyof typeof previousRef.current],
            );
            setError(`${entityProp}.${name} debe ser un número válido`);
            return;
        }

        const numValue = parseFloat(value);
        const entity = getCurrentEntity();
        if (!entity) {
            setError('Entidad no encontrada');
            return;
        }

        try {
            const currentProp = entity[entityProp];

            if (mode === 'cartesian' && (name === 'x' || name === 'y')) {
                const propPath = `${entityProp}.${name}` as
                    | 'position.x'
                    | 'position.y'
                    | 'velocity.x'
                    | 'velocity.y'
                    | 'acceleration.x'
                    | 'acceleration.y';

                useEntityStore
                    .getState()
                    .updateSpecificPropOfEntity(entityId, propPath, numValue);
            } else if (
                mode === 'polar' &&
                (name === 'angle' || name === 'magnitude')
            ) {
                let newX = currentProp.x ?? 0;
                let newY = currentProp.y ?? 0;

                if (name === 'angle') {
                    const magnitude =
                        typeof currentProp.mag === 'function'
                            ? currentProp.mag()
                            : 0;
                    newX = magnitude * Math.cos(numValue);
                    newY = magnitude * Math.sin(numValue);
                } else if (name === 'magnitude') {
                    const angle =
                        typeof currentProp.angle === 'function'
                            ? currentProp.angle()
                            : 0;
                    newX = numValue * Math.cos(angle);
                    newY = numValue * Math.sin(angle);
                }

                useEntityStore
                    .getState()
                    .updateSpecificPropOfEntity(
                        entityId,
                        `${entityProp}.x`,
                        newX,
                    );
                useEntityStore
                    .getState()
                    .updateSpecificPropOfEntity(
                        entityId,
                        `${entityProp}.y`,
                        newY,
                    );
            }

            previousRef.current[name as keyof typeof previousRef.current] =
                numValue;
            setError('');
        } catch (error) {
            console.error('Error updating entity:', error);
            setError('Error al actualizar la entidad');
            target.value = formatClean(
                previousRef.current[name as keyof typeof previousRef.current],
            );
        }
    };

    return (
        <div className="w-full flex items-center space-x-2">
            <Button
                onClick={() =>
                    setMode(mode === 'cartesian' ? 'polar' : 'cartesian')
                }
                type="button"
            >
                <VectorLetterIcon
                    letter={entityProp[0]}
                    className={styles.icon}
                />
            </Button>
            {mode === 'cartesian' && (
                <div className="w-full flex items-center space-x-2">
                    <Input
                        name="x"
                        ref={inputXRef}
                        type="number"
                        textPrefix="x"
                        className="flex grow"
                        placeholder="0"
                        onChange={handleChange}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        step={gap}
                    />
                    <Input
                        name="y"
                        ref={inputYRef}
                        type="number"
                        textPrefix="y"
                        className="flex grow"
                        placeholder="0"
                        onChange={handleChange}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        step={gap}
                    />
                </div>
            )}
            {mode === 'polar' && (
                <div className="w-full flex items-center space-x-2">
                    <Input
                        name="angle"
                        ref={inputAngleRef}
                        type="number"
                        textPrefix="∠"
                        className="flex grow"
                        placeholder="0"
                        onChange={handleChange}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        step={gap}
                    />
                    <Input
                        name="magnitude"
                        ref={inputMagnitudeRef}
                        type="number"
                        textPrefix="m"
                        className="flex grow"
                        placeholder="0"
                        onChange={handleChange}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        step={gap}
                        min="0"
                    />
                </div>
            )}
        </div>
    );
});

VectorInput.displayName = 'VectorInput';

export default VectorInput;
