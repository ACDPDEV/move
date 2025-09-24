'use client';
import TimeInput from '@/simulations/cinematica/components/inputs/TimeInput';
import { useState } from 'react';
import MovementPredictionToggle from '@/simulations/cinematica/components/buttons/MovementPredictionToggle';
import TimeSpeedSelector from '@/simulations/cinematica/components/selector/TimeSpeedSelector';
import DisplayOptionsSelector from '@/simulations/cinematica/components/selector/OptionsSelect';
import PlayerToggle from '@/simulations/cinematica/components/buttons/PlayerToogle';
import ResetButton from '@/simulations/cinematica/components/buttons/ResetButton';
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
