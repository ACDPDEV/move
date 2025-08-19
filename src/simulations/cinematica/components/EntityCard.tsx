'use client';
import React, { useState } from 'react';
import PositionXInput from './inputs/PositionXInput';
import PositionYInput from './inputs/PositionYInput';
import VelocityXInput from './inputs/VelocityXInput';
import VelocityYInput from './inputs/VelocityYInput';
import AccelerationXInput from './inputs/AccelerationXInput';
import AccelerationYInput from './inputs/AccelerationYInput';
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

interface EntityCardProps {
    entityId: string;
    color: string;
}

const VectorLetterIcon = ({
    letter = 'x',
    className = '',
    size = 24,
    ...props
}) => {
    // El tamaño base del SVG para calcular las proporciones
    const baseSize = 24;

    return (
        <svg
            className={className}
            width={size}
            height={size}
            viewBox={`0 0 ${baseSize} ${baseSize}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
        >
            {/* Flecha hacia la derecha */}
            <line
                x1={baseSize / 4}
                y1={baseSize / 4}
                x2={(baseSize * 3) / 4}
                y2={baseSize / 4}
            />
            <polyline
                points={`${(baseSize * 3) / 4 - 3},${baseSize / 4 - 3} ${
                    (baseSize * 3) / 4
                },${baseSize / 4} ${(baseSize * 3) / 4 - 3},${
                    baseSize / 4 + 3
                }`}
            />

            {/* Letra variable */}
            <text
                x="50%"
                y="75%"
                dominantBaseline="middle"
                textAnchor="middle"
                fontSize={baseSize * 0.8}
                fill="currentColor"
                stroke="none"
            >
                {letter}
            </text>
        </svg>
    );
};

export default function EntityCard({
    entityId,
    color,
}: Readonly<EntityCardProps>) {
    const [error, setError] = useState<string>('');

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
                <Button>
                    <VectorLetterIcon letter="x" className={styles.icon} />
                </Button>
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

            {/* Vector velocidad */}
            <div className="flex items-center space-x-2">
                <Button>
                    <VectorLetterIcon letter="v" className={styles.icon} />
                </Button>
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

            {/* Vector aceleración */}
            <div className="flex items-center space-x-2">
                <Button>
                    <VectorLetterIcon letter="a" className={styles.icon} />
                </Button>
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
