import { useCallback, useEffect } from 'preact/hooks';
import { useSimulation } from '@/simulations/cinematica/context/SimulationContext';
import type { DeepPartial } from '@/simulations/cinematica/types';
import type { DisplayOptions } from '@/simulations/cinematica/context/SimulationContext';

function useTimeHandlers(
  setSpeedInput: (value: string) => void
) {
  const {
    state: { isPlaying, speed, displayOptions, movementPrediction },
    play,
    pause,
    setSpeed,
    updateDisplayOptions,
    resetSimulation,
    updateMovementPrediction,
  } = useSimulation();

  const handlePlayPause = useCallback(() => {
    if (isPlaying) pause();
    else play();
  }, [isPlaying, play, pause]);

  const handleSpeedChange = useCallback((newSpeed: number) => {
    const clamped = Math.max(0.1, Math.min(3, newSpeed));
    setSpeed(clamped);
  }, [setSpeed]);

  const handleReset = useCallback(() => {
    resetSimulation();
  }, [resetSimulation]);

  useEffect(() => {
    setSpeedInput(speed.toFixed(1));
  }, [speed, setSpeedInput]);

  const handleSpeedInput = (e: Event) => {
    const target = e.target as HTMLInputElement;
    setSpeedInput(target.value);
  };

  const handleSpeedBlur = (e: Event) => {
    const target = e.target as HTMLInputElement;
    const val = parseFloat(target.value);
    if (!isNaN(val) && val >= 0.1 && val <= 3) {
      handleSpeedChange(val);
    } else {
      setSpeedInput(speed.toFixed(1));
    }
  };

  /**
   * Función genérica para togglear cualquier opción de display
   */
  const handleToggleDisplayOption = useCallback(
    (partial: DeepPartial<DisplayOptions>) => {
      updateDisplayOptions(partial);
    },
    [updateDisplayOptions]
  );

  /**
   * Ejemplos de uso:
   * handleToggleDisplayOption({ position: { resultant: !displayOptions.position.resultant } })
   * handleToggleDisplayOption({ trayectories: !displayOptions.trayectories })
   */

  const handleMovementPredictionToggle = useCallback(() => {
    updateMovementPrediction(!movementPrediction);
  }, [movementPrediction, updateMovementPrediction]);

  return {
    handlePlayPause,
    handleSpeedChange,
    handleReset,
    handleSpeedInput,
    handleSpeedBlur,
    handleToggleDisplayOption,
    handleMovementPredictionToggle,
  };
}

export { useTimeHandlers };
