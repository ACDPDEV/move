import { Entity } from '../entities/Entity';
import { useEntityStore } from '../store/useEntityStore';
import { useEffect, useRef, useState } from 'react';
import { useTimeStore } from '../store/useTimeStore';

interface error {
    positionX: string;
    positionY: string;
    velocityX: string;
    velocityY: string;
    accelerationX: string;
    accelerationY: string;
    radius: string;
    color: string;
}

interface previousValues {
    positionX: number;
    positionY: number;
    velocityX: number;
    velocityY: number;
    accelerationX: number;
    accelerationY: number;
    radius: number;
    color: string;
}

function EntityCard({
    entity,
}: Readonly<{
    entity: Entity;
}>) {
    const isPlaying = useTimeStore((s) => s.isPlaying);
    console.log('render', isPlaying);

    const animationIDRef = useRef<number | null>(null);

    const [error, setError] = useState<error>({
        positionX: '',
        positionY: '',
        velocityX: '',
        velocityY: '',
        accelerationX: '',
        accelerationY: '',
        radius: '',
        color: '',
    });
    const previousValuesRef = useRef<previousValues>({
        positionX: entity.position.x,
        positionY: entity.position.y,
        velocityX: entity.velocity.x,
        velocityY: entity.velocity.y,
        accelerationX: entity.acceleration.x,
        accelerationY: entity.acceleration.y,
        radius: entity.radius,
        color: entity.color,
    });
    const positionXInputRef = useRef<HTMLInputElement | null>(null);
    const positionYInputRef = useRef<HTMLInputElement | null>(null);
    const velocityXInputRef = useRef<HTMLInputElement | null>(null);
    const velocityYInputRef = useRef<HTMLInputElement | null>(null);
    const accelerationXInputRef = useRef<HTMLInputElement | null>(null);
    const accelerationYInputRef = useRef<HTMLInputElement | null>(null);
    const radiusInputRef = useRef<HTMLInputElement | null>(null);
    const colorInputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        const loop = () => {
            if (isPlaying) {
                const currentEntity = useEntityStore
                    .getState()
                    .entities.find(
                        (arrayEntity) => arrayEntity.id === entity.id,
                    );
                if (currentEntity) {
                    const positionXInput = positionXInputRef.current;
                    const positionYInput = positionYInputRef.current;
                    const velocityXInput = velocityXInputRef.current;
                    const velocityYInput = velocityYInputRef.current;
                    const accelerationXInput = accelerationXInputRef.current;
                    const accelerationYInput = accelerationYInputRef.current;
                    const radiusInput = radiusInputRef.current;
                    const colorInput = colorInputRef.current;

                    if (positionXInput) {
                        positionXInput.value =
                            currentEntity.position.x.toFixed(0);
                        previousValuesRef.current.positionX = Number(
                            currentEntity.position.x.toFixed(0),
                        );
                    }
                    if (positionYInput) {
                        positionYInput.value =
                            currentEntity.position.y.toFixed(0);
                        previousValuesRef.current.positionY = Number(
                            currentEntity.position.y.toFixed(0),
                        );
                    }
                    if (velocityXInput) {
                        velocityXInput.value =
                            currentEntity.velocity.x.toFixed(0);
                        previousValuesRef.current.velocityX = Number(
                            currentEntity.velocity.x.toFixed(0),
                        );
                    }
                    if (velocityYInput) {
                        velocityYInput.value =
                            currentEntity.velocity.y.toFixed(0);
                        previousValuesRef.current.velocityY = Number(
                            currentEntity.velocity.y.toFixed(0),
                        );
                    }
                    if (accelerationXInput) {
                        accelerationXInput.value =
                            currentEntity.acceleration.x.toFixed(0);
                        previousValuesRef.current.accelerationX = Number(
                            currentEntity.acceleration.x.toFixed(0),
                        );
                    }
                    if (accelerationYInput) {
                        accelerationYInput.value =
                            currentEntity.acceleration.y.toFixed(0);
                        previousValuesRef.current.accelerationY = Number(
                            currentEntity.acceleration.y.toFixed(0),
                        );
                    }
                    if (radiusInput) {
                        radiusInput.value = currentEntity.radius.toFixed(0);
                        Number(currentEntity.radius.toFixed(0));
                    }
                    if (colorInput) {
                        colorInput.value = currentEntity.color;
                        previousValuesRef.current.color = currentEntity.color;
                    }
                }
            }
            animationIDRef.current = requestAnimationFrame(loop);
        };
        animationIDRef.current = requestAnimationFrame(loop);
        return () => {
            cancelAnimationFrame(animationIDRef.current!);
        };
    }, [isPlaying, entity]);

    const onChangePositionX = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (isNaN(Number(event.target.value))) {
            event.target.value = previousValuesRef.current.positionX.toString();
            setError({
                ...error,
                positionX: 'posición x solo puede ser un número',
            });
            return;
        }
        event.target.value = event.target.value
            .replace(/^0+(?=\d)/, '')
            .replace(/^0+$/, '');
        previousValuesRef.current.positionX = Number(event.target.value);
        useEntityStore
            .getState()
            .updateSpecificPropOfEntity(
                entity.id,
                'position.x',
                Number(event.target.value),
            );
        setError({
            ...error,
            positionX: '',
        });
    };

    const onChangePositionY = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (isNaN(Number(event.target.value))) {
            event.target.value = previousValuesRef.current.positionY.toString();
            setError({
                ...error,
                positionY: 'posición y solo puede ser un número',
            });
            return;
        }
        event.target.value = event.target.value
            .replace(/^0+(?=\d)/, '')
            .replace(/^0+$/, '');
        previousValuesRef.current.positionY = Number(event.target.value);
        useEntityStore
            .getState()
            .updateSpecificPropOfEntity(
                entity.id,
                'position.y',
                Number(event.target.value),
            );
        setError({
            ...error,
            positionY: '',
        });
    };

    const onChangeVelocityX = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (isNaN(Number(event.target.value))) {
            event.target.value = previousValuesRef.current.velocityX.toString();
            setError({
                ...error,
                velocityX: 'velocidad x solo puede ser un número',
            });
            return;
        }
        event.target.value = event.target.value
            .replace(/^0+(?=\d)/, '')
            .replace(/^0+$/, '');
        previousValuesRef.current.velocityX = Number(event.target.value);
        useEntityStore
            .getState()
            .updateSpecificPropOfEntity(
                entity.id,
                'velocity.x',
                Number(event.target.value),
            );
        setError({
            ...error,
            velocityX: '',
        });
    };

    const onChangeVelocityY = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (isNaN(Number(event.target.value))) {
            event.target.value = previousValuesRef.current.velocityY.toString();
            setError({
                ...error,
                velocityY: 'velocidad y solo puede ser un número',
            });
            return;
        }
        event.target.value = event.target.value
            .replace(/^0+(?=\d)/, '')
            .replace(/^0+$/, '');
        previousValuesRef.current.velocityY = Number(event.target.value);
        useEntityStore
            .getState()
            .updateSpecificPropOfEntity(
                entity.id,
                'velocity.y',
                Number(event.target.value),
            );
        setError({
            ...error,
            velocityY: '',
        });
    };

    const onChangeAccelerationX = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        if (isNaN(Number(event.target.value))) {
            event.target.value =
                previousValuesRef.current.accelerationX.toString();
            setError({
                ...error,
                accelerationX: 'aceleración x solo puede ser un número',
            });
            return;
        }
        event.target.value = event.target.value
            .replace(/^0+(?=\d)/, '')
            .replace(/^0+$/, '');
        previousValuesRef.current.accelerationX = Number(event.target.value);
        useEntityStore
            .getState()
            .updateSpecificPropOfEntity(
                entity.id,
                'acceleration.x',
                Number(event.target.value),
            );
        setError({
            ...error,
            accelerationX: '',
        });
    };

    const onChangeAccelerationY = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        if (isNaN(Number(event.target.value))) {
            event.target.value =
                previousValuesRef.current.accelerationY.toString();
            setError({
                ...error,
                accelerationY: 'aceleración y solo puede ser un número',
            });
            return;
        }
        event.target.value = event.target.value
            .replace(/^0+(?=\d)/, '')
            .replace(/^0+$/, '');
        previousValuesRef.current.accelerationY = Number(event.target.value);
        useEntityStore
            .getState()
            .updateSpecificPropOfEntity(
                entity.id,
                'acceleration.y',
                Number(event.target.value),
            );
        setError({
            ...error,
            accelerationY: '',
        });
    };

    const onChangeRadius = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (isNaN(Number(event.target.value))) {
            event.target.value = previousValuesRef.current.radius.toString();
            setError({
                ...error,
                radius: 'radio solo puede ser un número',
            });
            return;
        }
        if (Number(event.target.value) <= 0) {
            event.target.value = previousValuesRef.current.radius.toString();
            setError({
                ...error,
                radius: 'radio solo puede ser un número mayor 0',
            });
            return;
        }
        previousValuesRef.current.radius = Number(event.target.value);
        useEntityStore
            .getState()
            .updateSpecificPropOfEntity(
                entity.id,
                'radius',
                Number(event.target.value),
            );
        setError({
            ...error,
            radius: '',
        });
    };

    const onChangeColor = (event: React.ChangeEvent<HTMLInputElement>) => {
        previousValuesRef.current.color = event.target.value;
        useEntityStore
            .getState()
            .updateSpecificPropOfEntity(entity.id, 'color', event.target.value);
        setError({
            ...error,
            color: '',
        });
    };

    return (
        <form>
            <div>
                <label htmlFor="positionX">Position X</label>
                <input
                    name="positionX"
                    type="number"
                    defaultValue={entity.position.x.toString()}
                    onChange={onChangePositionX}
                    ref={positionXInputRef}
                />
            </div>
            <div>
                <label htmlFor="positionY">Position Y</label>
                <input
                    name="positionY"
                    type="number"
                    defaultValue={entity.position.y.toString()}
                    onChange={onChangePositionY}
                    ref={positionYInputRef}
                />
            </div>
            <div>
                <label htmlFor="velocityX">Velocity X</label>
                <input
                    name="velocityX"
                    type="number"
                    defaultValue={entity.velocity.x.toString()}
                    onChange={onChangeVelocityX}
                    ref={velocityXInputRef}
                />
            </div>
            <div>
                <label htmlFor="velocityY">Velocity Y</label>
                <input
                    name="velocityY"
                    type="number"
                    defaultValue={entity.velocity.y.toString()}
                    onChange={onChangeVelocityY}
                    ref={velocityYInputRef}
                />
            </div>
            <div>
                <label htmlFor="accelerationX">Acceleration X</label>
                <input
                    name="accelerationX"
                    type="number"
                    defaultValue={entity.acceleration.x.toString()}
                    onChange={onChangeAccelerationX}
                    ref={accelerationXInputRef}
                />
            </div>
            <div>
                <label htmlFor="accelerationY">Acceleration Y</label>
                <input
                    name="accelerationY"
                    type="number"
                    defaultValue={entity.acceleration.y.toString()}
                    onChange={onChangeAccelerationY}
                    ref={accelerationYInputRef}
                />
            </div>
            <div>
                <label htmlFor="radius">Radius</label>
                <input
                    name="radius"
                    type="number"
                    defaultValue={entity.radius.toString()}
                    onChange={onChangeRadius}
                    ref={radiusInputRef}
                />
            </div>
            <div>
                <label htmlFor="color">Color</label>
                <input
                    name="color"
                    type="text"
                    defaultValue={entity.color}
                    onChange={onChangeColor}
                    ref={colorInputRef}
                />
            </div>
            {error.positionX && (
                <p className="text-red-500">{error.positionX}</p>
            )}
            {error.positionY && (
                <p className="text-red-500">{error.positionY}</p>
            )}
            {error.velocityX && (
                <p className="text-red-500">{error.velocityX}</p>
            )}
            {error.velocityY && (
                <p className="text-red-500">{error.velocityY}</p>
            )}
            {error.accelerationX && (
                <p className="text-red-500">{error.accelerationX}</p>
            )}
            {error.accelerationY && (
                <p className="text-red-500">{error.accelerationY}</p>
            )}
            {error.radius && <p className="text-red-500">{error.radius}</p>}
            {error.color && <p className="text-red-500">{error.color}</p>}
        </form>
    );
}

export default EntityCard;
