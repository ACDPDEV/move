import Input from '@/components/ui/better-input';
import Button from '@/components/ui/better-button';
import VectorLetterIcon from '../svgs/VectorSymbol';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import {
    useEntityStore,
    type EntityStore,
} from '@/simulations/cinematica/stores/useEntityStore';
import { Entity } from '@/simulations/cinematica/entities/Entity';
import { useURL } from '@/simulations/cinematica/hooks/useURL';
import { compressData } from '@/simulations/cinematica/utils/encodeAndDecodeEntities';
import styles from '@/simulations/cinematica/consts/styles';
import { formatClean } from '@/simulations/cinematica/utils/formatClean';
import { usePlaneStore } from '@/simulations/cinematica/stores/usePlaneStore';
import { useOptionsStore } from '@/simulations/cinematica/stores/useOptionsStore';
import { radiansToDegrees, degreesToRadians } from '@/simulations/lib/math';

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
    const floatPrecision = useOptionsStore((s) => s.inputs.floatPrecision);

    const isValidNumber = (value: string): boolean => {
        const num = parseFloat(value);
        if (value === '-' || value === '') return true;
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
        const angle =
            typeof prop.angle === 'function'
                ? radiansToDegrees(prop.angle())
                : 0;
        const magnitude = typeof prop.mag === 'function' ? prop.mag() : 0;

        if (inputXRef.current && !focus.x) {
            inputXRef.current.value = formatClean(x, floatPrecision);
            previousRef.current.x = x;
        }
        if (inputYRef.current && !focus.y) {
            inputYRef.current.value = formatClean(y, floatPrecision);
            previousRef.current.y = y;
        }
        if (inputAngleRef.current && !focus.angle) {
            inputAngleRef.current.value = formatClean(angle, floatPrecision);
            previousRef.current.angle = angle;
        }
        if (inputMagnitudeRef.current && !focus.magnitude) {
            inputMagnitudeRef.current.value = formatClean(
                magnitude,
                floatPrecision,
            );
            previousRef.current.magnitude = magnitude;
        }
    }, [entityId, entityProp, mode, focus, getCurrentEntity, floatPrecision]);

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
                    inputXRef.current.value = formatClean(x, floatPrecision);
                    previousRef.current.x = x;
                }
                if (inputYRef.current && !focus.y) {
                    const y = prop.y ?? 0;
                    inputYRef.current.value = formatClean(y, floatPrecision);
                    previousRef.current.y = y;
                }
            } else if (mode === 'polar') {
                if (inputAngleRef.current && !focus.angle) {
                    const angle =
                        typeof prop.angle === 'function'
                            ? radiansToDegrees(prop.angle())
                            : 0;
                    inputAngleRef.current.value = formatClean(
                        angle,
                        floatPrecision,
                    );
                    previousRef.current.angle = angle;
                }
                if (inputMagnitudeRef.current && !focus.magnitude) {
                    const magnitude =
                        typeof prop.mag === 'function' ? prop.mag() : 0;
                    inputMagnitudeRef.current.value = formatClean(
                        magnitude,
                        floatPrecision,
                    );
                    previousRef.current.magnitude = magnitude;
                }
            }
        };

        const unsubscribe = useEntityStore.subscribe(subscriber);
        return unsubscribe;
    }, [entityId, entityProp, mode, focus, floatPrecision]);

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

        if (!isValidNumber(value)) {
            target.value = formatClean(
                previousRef.current[name as keyof typeof previousRef.current],
            );
            setError(`${entityProp}.${name} debe ser un número válido`);
            return;
        }

        const parse = parseFloat(value);
        const numValue = value === '' || value === '-' ? 0 : parse;
        const entity = getCurrentEntity();
        if (!entity) {
            setError('Entidad no encontrada');
            return;
        }

        try {
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
                if (name === 'angle') {
                    const vector = useEntityStore
                        .getState()
                        .entities.find((e) => e.id === entityId)!
                        [entityProp].setAngle(degreesToRadians(numValue));
                    useEntityStore
                        .getState()
                        .updateSpecificPropOfEntity(
                            entityId,
                            `${entityProp}.x`,
                            vector.x,
                        );
                    useEntityStore
                        .getState()
                        .updateSpecificPropOfEntity(
                            entityId,
                            `${entityProp}.y`,
                            vector.y,
                        );
                } else if (name === 'magnitude') {
                    const vector = useEntityStore
                        .getState()
                        .entities.find((e) => e.id === entityId)!
                        [entityProp].setMag(numValue);
                    useEntityStore
                        .getState()
                        .updateSpecificPropOfEntity(
                            entityId,
                            `${entityProp}.x`,
                            vector.x,
                        );
                    useEntityStore
                        .getState()
                        .updateSpecificPropOfEntity(
                            entityId,
                            `${entityProp}.y`,
                            vector.y,
                        );
                }
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
                        className={styles.vectorInput}
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
                        className={styles.vectorInput}
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
                        className={styles.vectorInput}
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
                        className={styles.vectorInput}
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
