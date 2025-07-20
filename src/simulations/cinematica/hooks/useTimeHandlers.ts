import { useCallback, useEffect } from 'react';
import { useSimulationStore, type DisplayOptions } from '../store/useSimulationStore';

// Type for deep partial updates
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

function useTimeHandlers(
  setSpeedInput: (value: string) => void
) {
  const {
    isPlaying, 
    speed, 
    displayOptions, 
    movementPrediction,
    play,
    pause,
    setSpeed,
    updateDisplayOptions,
    resetSimulation,
    updateMovementPrediction,
  } = useSimulationStore();

  const handlePlayPause = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, play, pause]);

  const handleSpeedChange = useCallback((newSpeed: number) => {
    const clamped = Math.max(0.1, Math.min(3, newSpeed));
    setSpeed(clamped);
  }, [setSpeed]);

  const handleReset = useCallback(() => {
    resetSimulation();
  }, [resetSimulation]);

  // Update speed input when speed changes
  useEffect(() => {
    setSpeedInput(speed.toFixed(1));
  }, [speed, setSpeedInput]);

  const handleSpeedInput = useCallback((e: React.FormEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    setSpeedInput(target.value);
  }, [setSpeedInput]);

  const handleSpeedBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    const val = parseFloat(target.value);
    if (!isNaN(val) && val >= 0.1 && val <= 3) {
      handleSpeedChange(val);
    } else {
      // Reset to current speed if invalid input
      setSpeedInput(speed.toFixed(1));
    }
  }, [handleSpeedChange, speed, setSpeedInput]);

  /**
   * Generic function to toggle any display option
   * Usage examples:
   * - handleToggleDisplayOption({ position: { resultant: !displayOptions.position.resultant } })
   * - handleToggleDisplayOption({ trayectories: !displayOptions.trayectories })
   */
  const handleToggleDisplayOption = useCallback(
    (partial: DeepPartial<DisplayOptions>) => {
      updateDisplayOptions(partial);
    },
    [updateDisplayOptions]
  );

  /**
   * Specific helper functions for common display option toggles
   */
  const handleTogglePositionResultant = useCallback(() => {
    handleToggleDisplayOption({ 
      position: { 
        resultant: !displayOptions.position.resultant 
      } 
    });
  }, [displayOptions.position.resultant, handleToggleDisplayOption]);

  const handleTogglePositionComponents = useCallback(() => {
    handleToggleDisplayOption({ 
      position: { 
        components: !displayOptions.position.components 
      } 
    });
  }, [displayOptions.position.components, handleToggleDisplayOption]);

  const handleTogglePositionAngle = useCallback(() => {
    handleToggleDisplayOption({ 
      position: { 
        angle: !displayOptions.position.angle 
      } 
    });
  }, [displayOptions.position.angle, handleToggleDisplayOption]);

  const handleToggleVelocityResultant = useCallback(() => {
    handleToggleDisplayOption({ 
      velocity: { 
        resultant: !displayOptions.velocity.resultant 
      } 
    });
  }, [displayOptions.velocity.resultant, handleToggleDisplayOption]);

  const handleToggleVelocityComponents = useCallback(() => {
    handleToggleDisplayOption({ 
      velocity: { 
        components: !displayOptions.velocity.components 
      } 
    });
  }, [displayOptions.velocity.components, handleToggleDisplayOption]);

  const handleToggleVelocityAngle = useCallback(() => {
    handleToggleDisplayOption({ 
      velocity: { 
        angle: !displayOptions.velocity.angle 
      } 
    });
  }, [displayOptions.velocity.angle, handleToggleDisplayOption]);

  const handleToggleAccelerationResultant = useCallback(() => {
    handleToggleDisplayOption({ 
      acceleration: { 
        resultant: !displayOptions.acceleration.resultant 
      } 
    });
  }, [displayOptions.acceleration.resultant, handleToggleDisplayOption]);

  const handleToggleAccelerationComponents = useCallback(() => {
    handleToggleDisplayOption({ 
      acceleration: { 
        components: !displayOptions.acceleration.components 
      } 
    });
  }, [displayOptions.acceleration.components, handleToggleDisplayOption]);

  const handleToggleAccelerationAngle = useCallback(() => {
    handleToggleDisplayOption({ 
      acceleration: { 
        angle: !displayOptions.acceleration.angle 
      } 
    });
  }, [displayOptions.acceleration.angle, handleToggleDisplayOption]);

  const handleToggleTrajectories = useCallback(() => {
    handleToggleDisplayOption({ 
      trayectories: !displayOptions.trayectories 
    });
  }, [displayOptions.trayectories, handleToggleDisplayOption]);

  const handleToggleCoordinates = useCallback(() => {
    handleToggleDisplayOption({ 
      coordinates: !displayOptions.coordinates 
    });
  }, [displayOptions.coordinates, handleToggleDisplayOption]);

  const handleToggleAxes = useCallback(() => {
    handleToggleDisplayOption({ 
      axes: !displayOptions.axes 
    });
  }, [displayOptions.axes, handleToggleDisplayOption]);

  const handleMovementPredictionToggle = useCallback(() => {
    updateMovementPrediction(!movementPrediction);
  }, [movementPrediction, updateMovementPrediction]);

  return {
    // Basic controls
    handlePlayPause,
    handleSpeedChange,
    handleReset,
    handleSpeedInput,
    handleSpeedBlur,
    
    // Display options
    handleToggleDisplayOption,
    
    // Specific display option toggles
    handleTogglePositionResultant,
    handleTogglePositionComponents,
    handleTogglePositionAngle,
    handleToggleVelocityResultant,
    handleToggleVelocityComponents,
    handleToggleVelocityAngle,
    handleToggleAccelerationResultant,
    handleToggleAccelerationComponents,
    handleToggleAccelerationAngle,
    handleToggleTrajectories,
    handleToggleCoordinates,
    handleToggleAxes,
    
    // Movement prediction
    handleMovementPredictionToggle,
  };
}

export { useTimeHandlers };
export type { DeepPartial };