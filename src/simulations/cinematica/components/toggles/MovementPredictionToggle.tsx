import { Button } from '@/components/ui/button';
import { IconComponents, IconComponentsOff } from '@tabler/icons-react';
import { useTimeStore } from '@/simulations/cinematica/store/useTimeStore';

function MovementPredictionToggle() {
    const movementPrediction = useTimeStore((s) => s.movementPrediction);
    const updatePrediction = useTimeStore((s) => s.updatePrediction);

    return (
        <Button
            onClick={() => updatePrediction(!movementPrediction)}
            title="Predecir movimiento"
            variant="outline"
            className="text-stone-300 hover:text-white hover:bg-stone-700 p-2 rounded transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-stone-500"
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
