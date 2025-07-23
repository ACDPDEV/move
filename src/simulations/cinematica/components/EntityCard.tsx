'use client';
import PositionXInput from './inputs/PositionXInput';
import PositionYInput from './inputs/PositionYInput';
import VelocityXInput from './inputs/VelocityXInput';
import VelocityYInput from './inputs/VelocityYInput';
import AccelerationXInput from './inputs/AccelerationXInput';
import AccelerationYInput from './inputs/AccelerationYInput';
import RadiusInput from './inputs/RadiusInput';
import ColorInput from './inputs/ColorInput';
import { useState } from 'react';

function EntityCard({
    entityId,
}: Readonly<{
    entityId: string;
}>) {
    console.log('render entity');

    const [error, setError] = useState<string>('');
    return (
        <form>
            <PositionXInput entityId={entityId} setError={setError} />
            <PositionYInput entityId={entityId} />
            <VelocityXInput entityId={entityId} />
            <VelocityYInput entityId={entityId} />
            <AccelerationXInput entityId={entityId} />
            <AccelerationYInput entityId={entityId} />
            <RadiusInput entityId={entityId} setError={setError} />
            <ColorInput entityId={entityId} />

            {error && <p className="text-red-500">{error}</p>}
        </form>
    );
}

export default EntityCard;
