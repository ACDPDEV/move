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
            className={`border-2 rounded-lg p-4 space-y-4`}
            style={{ borderColor: color }}
        >
            <div className="flex justify-between">
                <FlowEntityButton entityId={entityId} />
                <ShapeSelector entityId={entityId} setError={setError} />
                <DeleteEntityButton entityId={entityId} />
            </div>

            {/* Vector posición */}
            <div className="flex items-center space-x-2">
                <VectorLetterIcon letter="x" size={16} />
                <PositionXInput
                    entityId={entityId}
                    setError={setError}
                    className="flex-1"
                />
                <span className="text-gray-400">|</span>
                <PositionYInput
                    entityId={entityId}
                    setError={setError}
                    className="flex-1"
                />
            </div>

            {/* Vector velocidad */}
            <div className="flex items-center space-x-2">
                <VectorLetterIcon letter="v" size={16} />
                <VelocityXInput
                    entityId={entityId}
                    setError={setError}
                    className="flex-1"
                />
                <span className="text-gray-400">|</span>
                <VelocityYInput
                    entityId={entityId}
                    setError={setError}
                    className="flex-1"
                />
            </div>

            {/* Vector aceleración */}
            <div className="flex items-center space-x-2">
                <VectorLetterIcon letter="a" size={16} />
                <AccelerationXInput
                    entityId={entityId}
                    setError={setError}
                    className="flex-1"
                />
                <span className="text-gray-400">|</span>
                <AccelerationYInput
                    entityId={entityId}
                    setError={setError}
                    className="flex-1"
                />
            </div>

            {/* Radio y Color lado a lado */}
            <div className="flex space-x-4">
                <div className="flex-1 border rounded-lg p-3">
                    <label className="block text-sm font-medium mb-1">
                        Radio
                    </label>
                    <RadiusInput
                        entityId={entityId}
                        setError={setError}
                        className="w-full"
                    />
                </div>
                <div className="flex-1 border rounded-lg p-3">
                    <label className="block text-sm font-medium mb-1">
                        Color
                    </label>
                    <ColorInput
                        entityId={entityId}
                        setError={setError}
                        className="w-full"
                    />
                </div>
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
