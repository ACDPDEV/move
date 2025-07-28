import { Button } from '@/components/ui/button';
import { IconComponents, IconComponentsOff } from '@tabler/icons-react';
import { useTimeStore } from '@/simulations/cinematica/stores/useTimeStore';

function MovementPredictionToggle() {
    const togglePrediction = useTimeStore((s) => s.togglePrediction);
    const movementPrediction = useTimeStore((s) => s.movementPrediction);

    return (
        <Button
            onClick={() => togglePrediction()}
            title="Predecir movimiento"
            variant="outline"
            className="text-stone-700 dark:text-stone-300  dark:hover:bg-stone-700 p-2 rounded transition-all duration-200 hover:scale-125 focus:outline-none focus:ring-2 focus:ring-stone-500"
            type="button"
        >
            {movementPrediction ? (
                <IconComponents size={20} />
            ) : (
                <IconComponentsOff size={20} />
            )}
        </Button>
    );
}

export default MovementPredictionToggle;
