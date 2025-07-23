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
import { Button } from '@/components/ui/button';
import { IconAlertCircle, IconTrash } from '@tabler/icons-react';
import { useEntityStore } from '../store/useEntityStore';
import { Alert, AlertTitle } from '@/components/ui/alert';

interface EntityCardProps {
    entityId: string;
    color: string;
}

export default function EntityCard({
    entityId,
    color,
}: Readonly<EntityCardProps>) {
    const [error, setError] = useState<string>('');
    const deleteEntity = () => useEntityStore.getState().deleteEntity(entityId);

    return (
        <div
            className={`border-2 rounded-lg p-4 space-y-4`}
            style={{ borderColor: color }}
        >
            <div className="flex justify-end">
                <Button variant="outline" size="icon" onClick={deleteEntity}>
                    <IconTrash />
                </Button>
            </div>

            {/* Vector posición */}
            <div className="flex items-center space-x-2">
                <span className="font-bold">[x⃗]</span>
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
                <span className="font-bold">[v⃗]</span>
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
                <span className="font-bold">[a⃗]</span>
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
