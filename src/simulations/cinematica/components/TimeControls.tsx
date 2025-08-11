'use client';
import { Separator } from '@/components/ui/separator';
import TimeInput from './inputs/TimeInput';
import { useState } from 'react';
import MovementPredictionToggle from './buttons/MovementPredictionToggle';
import TimeSpeedSelector from './selector/TimeSpeedSelector';
import DisplayOptionsSelector from './selector/DisplayOptionsSelector';
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
            <Separator
                orientation="vertical"
                className="h-6 bg-stone-600 hidden sm:flex"
            />
            <div className="items-center gap-2 hidden sm:flex">
                <DisplayOptionsSelector />
            </div>
        </div>
    );
}
