import { IconLink, IconLinkOff } from '@tabler/icons-react';
import { useTimeStore } from '@/simulations/cinematica/stores/useTimeStore';
import Button from '@/components/ui/better-button';
import styles from '../../consts/styles';

function useMovementPredictionToggle() {
    const togglePrediction = useTimeStore((s) => s.togglePrediction);
    const movementPrediction = useTimeStore((s) => s.movementPrediction);

    const onClick = () => {
        togglePrediction();
    };

    return { onClick, movementPrediction };
}

function MovementPredictionToggle() {
    const { onClick, movementPrediction } = useMovementPredictionToggle();

    return (
        <Button
            onClick={onClick}
            tooltip={
                movementPrediction
                    ? 'Desactivar predicción'
                    : 'Activar predicción'
            }
        >
            {movementPrediction ? (
                <IconLinkOff className={styles.icon} />
            ) : (
                <IconLink className={styles.icon} />
            )}
        </Button>
    );
}

export default MovementPredictionToggle;
