'use client';
import React, { useState } from 'react';
import RadiusInput from './inputs/RadiusInput';
import ColorInput from './inputs/ColorInput';
import { Alert, AlertTitle } from '@/components/ui/alert';
import ShapeSelector from './selector/ShapeSelector';
import FlowEntityButton from './buttons/FlowEntityButton';
import DeleteEntityButton from './buttons/DeleteEntityButton';
import { IconAlertCircle } from '@tabler/icons-react';
import Button from './ui/button';
import styles from '../consts/styles';
import EntityInput from './inputs/EntityInput';
import VectorLetterIcon from './svgs/VectorSymbol';
import AngleInput from './inputs/AngleInput';
import MagnitudeInput from './inputs/MagnitudeInput';

interface EntityCardProps {
    entityId: string;
    color: string;
}

export default function EntityCard({
    entityId,
    color,
}: Readonly<EntityCardProps>) {
    const [error, setError] = useState<string>('');
    const [groupInputTypeX, setGroupInputTypeX] = useState<
        'vectorComponents' | 'AngleAndMAgnitude'
    >('vectorComponents');
    const [groupInputTypeV, setGroupInputTypeV] = useState<
        'vectorComponents' | 'AngleAndMAgnitude'
    >('vectorComponents');
    const [groupInputTypeA, setGroupInputTypeA] = useState<
        'vectorComponents' | 'AngleAndMAgnitude'
    >('vectorComponents');

    return (
        <div
            className={`border-2 rounded-lg bg-[#202C25] p-4 space-y-4`}
            style={{ borderColor: color }}
        >
            <div className="flex justify-between">
                <FlowEntityButton entityId={entityId} />
                <ShapeSelector entityId={entityId} setError={setError} />
                <DeleteEntityButton entityId={entityId} />
            </div>

            {/* Vector posición */}
            <div className="flex items-center space-x-2">
                <Button
                    onClick={() =>
                        setGroupInputTypeX(
                            groupInputTypeX === 'vectorComponents'
                                ? 'AngleAndMAgnitude'
                                : 'vectorComponents',
                        )
                    }
                >
                    <VectorLetterIcon letter="x" className={styles.icon} />
                </Button>
                {groupInputTypeX === 'vectorComponents' && (
                    <div className="flex items-center space-x-2">
                        <EntityInput
                            entityId={entityId}
                            entityProp="position.x"
                            setError={setError}
                        />
                        <EntityInput
                            entityId={entityId}
                            entityProp="position.y"
                            setError={setError}
                        />
                    </div>
                )}
                {groupInputTypeX === 'AngleAndMAgnitude' && (
                    <div className="flex items-center space-x-2">
                        <AngleInput
                            entityId={entityId}
                            entityProp="position"
                            setError={setError}
                        />
                        <MagnitudeInput
                            entityId={entityId}
                            entityProp="position"
                            setError={setError}
                        />
                    </div>
                )}
            </div>

            {/* Vector velocidad */}
            <div className="flex items-center space-x-2">
                <Button
                    onClick={() =>
                        setGroupInputTypeV(
                            groupInputTypeV === 'vectorComponents'
                                ? 'AngleAndMAgnitude'
                                : 'vectorComponents',
                        )
                    }
                >
                    <VectorLetterIcon letter="v" className={styles.icon} />
                </Button>
                {groupInputTypeV === 'vectorComponents' && (
                    <div className="flex items-center space-x-2">
                        <EntityInput
                            entityId={entityId}
                            entityProp="velocity.x"
                            setError={setError}
                        />
                        <EntityInput
                            entityId={entityId}
                            entityProp="velocity.y"
                            setError={setError}
                        />
                    </div>
                )}
                {groupInputTypeV === 'AngleAndMAgnitude' && (
                    <div className="flex items-center space-x-2">
                        <AngleInput
                            entityId={entityId}
                            entityProp="velocity"
                            setError={setError}
                        />
                        <MagnitudeInput
                            entityId={entityId}
                            entityProp="velocity"
                            setError={setError}
                        />
                    </div>
                )}
            </div>

            {/* Vector aceleración */}
            <div className="flex items-center space-x-2">
                <Button
                    onClick={() =>
                        setGroupInputTypeA(
                            groupInputTypeA === 'vectorComponents'
                                ? 'AngleAndMAgnitude'
                                : 'vectorComponents',
                        )
                    }
                >
                    <VectorLetterIcon letter="a" className={styles.icon} />
                </Button>
                {groupInputTypeA === 'vectorComponents' && (
                    <div className="flex items-center space-x-2">
                        <EntityInput
                            entityId={entityId}
                            entityProp="acceleration.x"
                            setError={setError}
                        />
                        <EntityInput
                            entityId={entityId}
                            entityProp="acceleration.y"
                            setError={setError}
                        />
                    </div>
                )}
                {groupInputTypeA === 'AngleAndMAgnitude' && (
                    <div className="flex items-center space-x-2">
                        <AngleInput
                            entityId={entityId}
                            entityProp="acceleration"
                            setError={setError}
                        />
                        <MagnitudeInput
                            entityId={entityId}
                            entityProp="acceleration"
                            setError={setError}
                        />
                    </div>
                )}
            </div>

            {/* Radio y Color lado a lado */}
            <div className="flex space-x-4">
                <RadiusInput
                    entityId={entityId}
                    setError={setError}
                    className="flex flex-1 w-full"
                />
                <ColorInput
                    entityId={entityId}
                    setError={setError}
                    className="flex flex-1 w-full"
                />
            </div>

            {/* Error */}
            {error && (
                <Alert
                    variant="destructive"
                    className="flex items-center space-x-2"
                >
                    <IconAlertCircle size={16} />
                    <AlertTitle>{error}</AlertTitle>
                </Alert>
            )}
        </div>
    );
}

export { EntityCard };
