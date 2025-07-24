'use client';
import React, { memo } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverTrigger } from '@/components/ui/popover';
import { PopoverContent } from '@radix-ui/react-popover';
import { useTimeStore } from '../../store/useTimeStore';

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
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline" className={className}>
                    x{speed}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="flex flex-col gap-2 p-2 w-fit bg-stone-800 border-stone-700 rounded-md">
                <Button
                    variant="ghost"
                    className={`w-full justify-center text-left hover:border hover:border-bg-secondary ${
                        speed === 3 ? 'bg-primary-foreground' : ''
                    }`}
                    onClick={() => updateSpeed(3)}
                >
                    x3
                </Button>
                <Button
                    variant="ghost"
                    className={`w-full justify-center text-left hover:border hover:border-bg-secondary ${
                        speed === 2 ? 'bg-primary-foreground' : ''
                    }`}
                    onClick={() => updateSpeed(2)}
                >
                    x2
                </Button>
                <Button
                    variant="ghost"
                    className={`w-full justify-center text-left hover:border hover:border-bg-secondary ${
                        speed === 1 ? 'bg-primary-foreground' : ''
                    }`}
                    onClick={() => updateSpeed(1)}
                >
                    x1
                </Button>
                <Button
                    variant="ghost"
                    className={`w-full justify-center text-left hover:border hover:border-bg-secondary ${
                        speed === 0.5 ? 'bg-primary-foreground' : ''
                    }`}
                    onClick={() => updateSpeed(0.5)}
                >
                    x0.5
                </Button>
                <Button
                    variant="ghost"
                    className={`w-full justify-center text-left hover:border hover:border-bg-secondary ${
                        speed === 0.25 ? 'bg-primary-foreground' : ''
                    }`}
                    onClick={() => updateSpeed(0.25)}
                >
                    x0.25
                </Button>
            </PopoverContent>
        </Popover>
    );
});

TimeSpeedSelector.displayName = 'TimeSpeedSelector';

export default TimeSpeedSelector;
