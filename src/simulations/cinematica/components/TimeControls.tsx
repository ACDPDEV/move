'use client';
import { Separator } from '@/components/ui/separator';
import TimeInput from './inputs/TimeInput';
import { useState } from 'react';
import MovementPredictionToggle from './toggles/MovementPredictionToggle';
import TimeSpeedSelector from './selector/TimeSpeedSelector';
import DisplayOptionsSelector from './selector/DisplayOptionsSelector';
import PlayerToggle from './toggles/PlayerToogle';
import ResetButton from './toggles/ResetButton';

export default function TimeControls() {
    console.log('render time controls');

    const [error, setError] = useState<string>('');

    return (
        <div className="flex flex-row bg-stone-800/90 border border-stone-700 items-center justify-center p-3 gap-3 rounded-lg backdrop-blur-md shadow-lg">
            {/* Time input */}
            <div className="flex items-center gap-2">
                <span className="text-xs text-stone-400 whitespace-nowrap">
                    Tiempo:
                </span>
                <TimeInput setError={setError} />
                <MovementPredictionToggle />
            </div>

            <Separator orientation="vertical" className="h-6 bg-stone-600" />

            {/* Speed input */}
            <TimeSpeedSelector setError={setError} />

            <Separator orientation="vertical" className="h-6 bg-stone-600" />

            {/* Display options popover */}
            <DisplayOptionsSelector />

            <Separator orientation="vertical" className="h-6 bg-stone-600" />

            {/* Play/Pause & Reset */}
            <div className="flex items-center gap-2">
                <PlayerToggle />
                <ResetButton />
            </div>
        </div>
    );
}
