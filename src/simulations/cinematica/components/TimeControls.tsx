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
import { ModeToggle } from '@/components/layout/ToogleTheme';

export default function TimeControls() {
    const [error, setError] = useState<string>('');

    if (error) {
        toast(error);
    }

    return (
        <div className="flex flex-row text-stone-900 dark:text-stone-100 dark:bg-stone-800/90 bg-stone-200 border dark:border-stone-700 border-stone-300 items-center justify-center p-3 gap-3 rounded-lg backdrop-blur-md shadow-lg">
            <div className="flex items-center gap-2">
                <TimeInput setError={setError} />
                <MovementPredictionToggle />
            </div>
            <Separator orientation="vertical" className="h-6 bg-stone-600" />
            <div className="flex items-center gap-2">
                <PlayerToggle />
                <ResetButton />
                <TimeSpeedSelector setError={setError} />
            </div>
            <Separator orientation="vertical" className="h-6 bg-stone-600" />
            <div className="flex items-center gap-2">
                <DisplayOptionsSelector />
                <ModeToggle />
            </div>
        </div>
    );
}
