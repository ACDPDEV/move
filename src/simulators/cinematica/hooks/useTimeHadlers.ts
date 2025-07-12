import { useCallback, useEffect } from 'preact/hooks';
import { useSimulation } from '@/simulators/cinematica/context/SimulationContext';

function useTimeHandlers(
    setSpeedInput: (value: string) => void
) {
    const { 
        state: { isPlaying, speed, showVectors, movementPrediction },
        play, 
        pause, 
        setSpeed, 
        updateShowVectors, 
        resetSimulation,
        updateMovementPrediction
    } = useSimulation();


    const handlePlayPause = useCallback(() => {
        if (isPlaying) {
            pause();
        } else {
            play();
        }
    }, [isPlaying, play, pause]);

    const handleSpeedChange = useCallback((newSpeed: number) => {
        const clampedSpeed = Math.max(0.1, Math.min(3, newSpeed));
        setSpeed(clampedSpeed);
    }, [setSpeed]);

    const handleReset = useCallback(() => {
        resetSimulation();
    }, [resetSimulation]);

    // Sincroniza el input local si cambia el prop speed
    useEffect(() => {
        setSpeedInput(speed.toFixed(1));
    }, [speed]);

    /**
     * Maneja el cambio directo de velocidad mediante input
     */
    const handleSpeedInput = (event: Event) => {
        const target = event.target as HTMLInputElement;
        setSpeedInput(target.value);
    };

    const handleSpeedBlur = (event: Event) => {
        const target = event.target as HTMLInputElement;
        const newSpeed = parseFloat(target.value);
        if (!isNaN(newSpeed) && newSpeed >= 0.1 && newSpeed <= 3) {
            handleSpeedChange(newSpeed);
        } else {
            setSpeedInput(speed.toFixed(1)); // Restaura valor válido
        }
    };

    const handleShowVectorsChange = () => {
        updateShowVectors(!showVectors);
    };

    const handleMovementPrediction = () => {
        updateMovementPrediction(!movementPrediction);
    };

    return {
        handlePlayPause,
        handleSpeedChange,
        handleReset,
        handleSpeedInput,
        handleSpeedBlur,
        handleShowVectorsChange,
        handleMovementPrediction,
    }
}

export { useTimeHandlers };