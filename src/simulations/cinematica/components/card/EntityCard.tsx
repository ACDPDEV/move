'use client';
import React, { useState } from 'react';
import RadiusInput from '@/simulations/cinematica/components/inputs/RadiusInput';
import ColorInput from '@/simulations/cinematica/components/inputs/ColorInput';
import { Alert, AlertTitle } from '@/components/ui/alert';
import ShapeSelector from '@/simulations/cinematica/components/selector/ShapeSelector';
import FlowEntityButton from '@/simulations/cinematica/components/buttons/FlowEntityButton';
import DeleteEntityButton from '@/simulations/cinematica/components/buttons/DeleteEntityButton';
import { IconAlertCircle } from '@tabler/icons-react';
import VectorInput from '@/simulations/cinematica/components/inputs/VectorInput';
import { useOptionsStore } from '@/simulations/cinematica/stores/useOptionsStore';

interface EntityCardProps {
    entityId: string;
    color: string;
}

export default function EntityCard({
    entityId,
    color,
}: Readonly<EntityCardProps>) {
    const [error, setError] = useState<string>('');
    const { inputs } = useOptionsStore();

    return (
        <div
            className={`border-2 rounded-lg bg-[#202C25] p-4 space-y-4`}
            style={{ borderColor: color }}
        >
            <div className="flex justify-between">
                <FlowEntityButton entityId={entityId} />
                <ShapeSelector entityId={entityId} />
                <DeleteEntityButton entityId={entityId} />
            </div>

            {inputs.position && (
                <VectorInput
                    entityId={entityId}
                    entityProp="position"
                    setError={setError}
                />
            )}

            {inputs.velocity && (
                <VectorInput
                    entityId={entityId}
                    entityProp="velocity"
                    setError={setError}
                />
            )}

            {inputs.acceleration && (
                <VectorInput
                    entityId={entityId}
                    entityProp="acceleration"
                    setError={setError}
                />
            )}

            {/* Radio y Color lado a lado */}
            <div className="flex space-x-4">
                {inputs.radius && (
                    <RadiusInput entityId={entityId} setError={setError} />
                )}
                {inputs.color && (
                    <ColorInput
                        entityId={entityId}
                        setError={setError}
                        className="flex flex-1 w-full"
                    />
                )}
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
