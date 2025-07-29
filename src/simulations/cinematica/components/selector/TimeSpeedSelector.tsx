'use client';
import React, { memo } from 'react';
import { useTimeStore } from '../../stores/useTimeStore';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';

interface TimeSpeedSelectorProps {
    className?: string;
    setError: React.Dispatch<React.SetStateAction<string>>;
}

const TimeSpeedSelector = memo(function TimeSelectorInput({
    className,
}: TimeSpeedSelectorProps) {
    const speed = useTimeStore((s) => s.speed);
    const updateSpeed = useTimeStore((s) => s.updateSpeed);

    return (
        <Select
            onValueChange={(value) => updateSpeed(Number(value))}
            defaultValue={speed.toFixed(2)}
        >
            <Tooltip>
                <TooltipTrigger asChild>
                    <SelectTrigger
                        className={`text-stone-700 dark:text-stone-300  dark:hover:bg-stone-700 p-2 rounded transition-all duration-200 hover:scale-125 focus:outline-none focus:ring-2 focus:ring-stone-500 ${className}`}
                    >
                        <SelectValue />
                    </SelectTrigger>
                </TooltipTrigger>
                <TooltipContent>Velocidad de reproducción</TooltipContent>
            </Tooltip>
            <SelectContent>
                <SelectItem value="0.25">x 0.25</SelectItem>
                <SelectItem value="0.50">x 0.5</SelectItem>
                <SelectItem value="1.00">x 1</SelectItem>
                <SelectItem value="2.00">x 2</SelectItem>
                <SelectItem value="3.00">x 3</SelectItem>
            </SelectContent>
        </Select>
    );
});

TimeSpeedSelector.displayName = 'TimeSpeedSelector';

export default TimeSpeedSelector;
