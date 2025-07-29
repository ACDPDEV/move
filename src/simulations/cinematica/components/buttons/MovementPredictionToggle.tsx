import { Button } from '@/components/ui/button';
import { IconLink, IconLinkOff } from '@tabler/icons-react';
import { useTimeStore } from '@/simulations/cinematica/stores/useTimeStore';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';

function MovementPredictionToggle() {
    const togglePrediction = useTimeStore((s) => s.togglePrediction);
    const movementPrediction = useTimeStore((s) => s.movementPrediction);

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Button
                    onClick={() => togglePrediction()}
                    variant="outline"
                    className="text-stone-700 dark:text-stone-300  dark:hover:bg-stone-700 p-2 rounded transition-all duration-200 hover:scale-125 focus:outline-none focus:ring-2 focus:ring-stone-500"
                    type="button"
                >
                    {movementPrediction ? (
                        <IconLink size={20} />
                    ) : (
                        <IconLinkOff size={20} />
                    )}
                </Button>
            </TooltipTrigger>
            <TooltipContent>
                {movementPrediction
                    ? 'Desactivar predicción'
                    : 'Activar predicción'}
            </TooltipContent>
        </Tooltip>
    );
}

export default MovementPredictionToggle;
