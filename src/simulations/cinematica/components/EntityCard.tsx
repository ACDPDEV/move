'use client';
import React, { useState } from 'react';
import RadiusInput from './inputs/RadiusInput';
import ColorInput from './inputs/ColorInput';
import { Alert, AlertTitle } from '@/components/ui/alert';
import ShapeSelector from './selector/ShapeSelector';
import FlowEntityButton from './buttons/FlowEntityButton';
import DeleteEntityButton from './buttons/DeleteEntityButton';
import { IconAlertCircle } from '@tabler/icons-react';
import VectorInput from './inputs/VectorInput';

interface EntityCardProps {
    entityId: string;
    color: string;
}

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

            <VectorInput
                entityId={entityId}
                entityProp="position"
                setError={setError}
            />

            <VectorInput
                entityId={entityId}
                entityProp="velocity"
                setError={setError}
            />

            <VectorInput
                entityId={entityId}
                entityProp="acceleration"
                setError={setError}
            />

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
