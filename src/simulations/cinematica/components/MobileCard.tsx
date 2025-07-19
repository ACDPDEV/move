import { Movil, type IMovilProps } from '@/simulations/cinematica/entities/Movil';
import { Vector2D } from '@/simulations/lib/utils';
import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { PositionVectorInput, VelocityVectorInput, AccelerationVectorInput } from './VectorInputs';
import { Dispatch, SetStateAction } from 'react';

type VectorInputsType = {
        [id: string]: {
            position?: { x?: string; y?: string };
            velocity?: { x?: string; y?: string };
            acceleration?: { x?: string; y?: string };
        };
    };

function MobileCard({ entity, displayIndex, onEntityChange, onEntityDelete, vectorInputs, setVectorInputs, handleInputChange }: Readonly<{
    entity: Movil;
    displayIndex: number;
    onEntityChange: (id: string, updates: Partial<Movil>) => void;
    onEntityDelete: (id: string) => void;
    vectorInputs: VectorInputsType;
    setVectorInputs: Dispatch<SetStateAction<VectorInputsType>>;
    handleInputChange: (id: string, property: keyof IMovilProps, value: number | string, vectorComponent?: 'x' | 'y') => void;
}>) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Móvil {displayIndex}</CardTitle>
            </CardHeader>
            <CardContent>
                <PositionVectorInput
                    entity={entity}
                    handleInputChange={onEntityChange}
                    vectorInputs={vectorInputs[entity.id!]?.position}
                    onBlurVector={(id, property, value, vectorComponent) => {
                        if (value !== '' && !isNaN(Number(value))) {
                            handleInputChange(id, property, Number(value), vectorComponent);
                        }
                        setVectorInputs((inputs: VectorInputsType) => {
                            const copy = { ...inputs };
                            if (copy[id] && copy[id][property as 'position' | 'velocity' | 'acceleration']) {
                                copy[id][property as 'position' | 'velocity' | 'acceleration'] = {
                                    ...copy[id][property as 'position' | 'velocity' | 'acceleration'],
                                    [vectorComponent!]: undefined
                                };
                            }
                            return copy;
                        });
                    }}
                />
                <VelocityVectorInput
                    entity={entity}
                    handleInputChange={onEntityChange}
                    vectorInputs={vectorInputs[entity.id!]?.velocity}
                    onBlurVector={(id, property, value, vectorComponent) => {
                        if (value !== '' && !isNaN(Number(value))) {
                            handleInputChange(id, property, Number(value), vectorComponent);
                        }
                        setVectorInputs((inputs: VectorInputsType) => {
                            const copy = { ...inputs };
                            if (copy[id] && copy[id][property as 'position' | 'velocity' | 'acceleration']) {
                                copy[id][property as 'position' | 'velocity' | 'acceleration'] = {
                                    ...copy[id][property as 'position' | 'velocity' | 'acceleration'],
                                    [vectorComponent!]: undefined
                                };
                            }
                            return copy;
                        });
                    }}
                />
                <AccelerationVectorInput
                    entity={entity}
                    handleInputChange={onEntityChange}
                    vectorInputs={vectorInputs[entity.id!]?.acceleration}
                    onBlurVector={(id, property, value, vectorComponent) => {
                        if (value !== '' && !isNaN(Number(value))) {
                            handleInputChange(id, property, Number(value), vectorComponent);
                        }
                        setVectorInputs((inputs: VectorInputsType) => {
                            const copy = { ...inputs };
                            if (copy[id] && copy[id][property as 'position' | 'velocity' | 'acceleration']) {
                                copy[id][property as 'position' | 'velocity' | 'acceleration'] = {
                                    ...copy[id][property as 'position' | 'velocity' | 'acceleration'],
                                    [vectorComponent!]: undefined
                                };
                            }
                            return copy;
                        });
                    }}
                />
            </CardContent>
        </Card>
    )
}

export { MobileCard };