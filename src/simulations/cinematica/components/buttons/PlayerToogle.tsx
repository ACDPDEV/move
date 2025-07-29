import { Button } from '@/components/ui/button';
import { IconPlayerPause, IconPlayerPlay } from '@tabler/icons-react';
import { useTimeStore } from '@/simulations/cinematica/stores/useTimeStore';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';

function PlayerToggle() {
    const isPlaying = useTimeStore((s) => s.isPlaying);
    const togglePlayer = useTimeStore((s) => s.togglePlayer);

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Button
                    onClick={togglePlayer}
                    className="text-stone-700 dark:text-stone-300  dark:hover:bg-stone-700 p-2 rounded transition-all duration-200 hover:scale-125 focus:outline-none focus:ring-2 focus:ring-stone-500"
                    type="button"
                    variant="outline"
                >
                    {isPlaying ? (
                        <IconPlayerPause size={20} />
                    ) : (
                        <IconPlayerPlay size={20} />
                    )}
                </Button>
            </TooltipTrigger>
            <TooltipContent>{isPlaying ? 'Pausar' : 'Iniciar'}</TooltipContent>
        </Tooltip>
    );
}

export default PlayerToggle;
