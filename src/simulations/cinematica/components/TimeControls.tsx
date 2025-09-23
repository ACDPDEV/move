'use client';
import TimeInput from './inputs/TimeInput';
import { useState } from 'react';
import MovementPredictionToggle from './buttons/MovementPredictionToggle';
import TimeSpeedSelector from './selector/TimeSpeedSelector';
import DisplayOptionsSelector from './selector/OptionsSelect';
import PlayerToggle from './buttons/PlayerToogle';
import ResetButton from './buttons/ResetButton';
import { toast } from 'sonner';

export default function TimeControls() {
    const [error, setError] = useState<string>('');

    if (error) {
        toast(error);
    }

    return (
        <div className="flex flex-row w-fit h-fit p-4 gap-4 bg-[#202C25] rounded-lg">
            <div className="flex items-center gap-2">
                <TimeInput setError={setError} />
                <MovementPredictionToggle />
                <PlayerToggle />
                <ResetButton />
                <TimeSpeedSelector />
            </div>
            <div className="items-center gap-2 hidden sm:flex">
                <DisplayOptionsSelector />
            </div>
        </div>
    );
}
