"use client"
import { useState } from 'react';
import {
  IconPlayerPause,
  IconPlayerPlay,
  IconReload,
  IconComponents,
  IconComponentsOff,
  IconSettings,
} from '@tabler/icons-react';
import { useTimeHandlers } from '@/simulations/cinematica/hooks/useTimeHandlers';
import { useSimulationStore } from '../store/useSimulationStore';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

function PlayerButtons({
  isPlaying,
  onPlayPause,
  onReset,
}: {
  isPlaying: boolean;
  onPlayPause: () => void;
  onReset: () => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <button
        className="text-stone-300 hover:text-white hover:bg-stone-700 p-2 rounded transition-all hover:scale-105"
        onClick={onPlayPause}
        title={isPlaying ? 'Pausar' : 'Reproducir'}
      >
        {isPlaying ? <IconPlayerPause size={20} /> : <IconPlayerPlay size={20} />}
      </button>
      <button
        className="text-stone-300 hover:text-white hover:bg-stone-700 p-2 rounded transition-all hover:scale-105"
        onClick={onReset}
        title="Reiniciar simulación"
      >
        <IconReload size={20} />
      </button>
    </div>
  );
}

function SpeedInput({
  speed,
  inputValue,
  onIncrement,
  onDecrement,
  onInput,
  onBlur,
}: {
  speed: number;
  inputValue: string;
  onIncrement: () => void;
  onDecrement: () => void;
  onInput: (e: React.FormEvent<HTMLInputElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-stone-400">Velocidad:</span>
      <button 
        onClick={onDecrement} 
        disabled={speed <= 0.1} 
        className="text-stone-400 hover:text-white hover:bg-stone-700 w-6 h-6 rounded flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
        title="Disminuir velocidad"
      >
        -
      </button>
      <input
        type="number"
        min="0.1"
        max="3"
        step="0.1"
        value={inputValue}
        onInput={onInput}
        onBlur={onBlur}
        className="w-12 text-center text-sm text-stone-200 bg-stone-700 border border-stone-600 rounded px-1 py-0.5 focus:outline-none focus:border-stone-500 [&::-webkit-inner-spin-button]:hidden"
      />
      <button 
        onClick={onIncrement} 
        disabled={speed >= 3} 
        className="text-stone-400 hover:text-white hover:bg-stone-700 w-6 h-6 rounded flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
        title="Aumentar velocidad"
      >
        +
      </button>
    </div>
  );
}

function TimeInput({
  time,
  onTimeChange,
  onTimeInputToggle,
  onPredictToggle,
  movementPrediction,
}: {
  time: number;
  onTimeChange: (n: number) => void;
  onTimeInputToggle: (flag: boolean) => void;
  onPredictToggle: () => void;
  movementPrediction: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-stone-400">Tiempo:</span>
      <input
        type="number"
        value={time.toFixed(2)}
        onInput={(e) => {
          const v = parseFloat((e.target as HTMLInputElement).value);
          if (isNaN(v)) return;
          onTimeInputToggle(true);
          onTimeChange(v);
        }}
        className="w-20 text-center text-sm text-stone-200 bg-stone-700 border border-stone-600 rounded px-1 py-0.5 focus:outline-none focus:border-stone-500 [&::-webkit-inner-spin-button]:hidden"
      />
      <button
        className="text-stone-300 hover:text-white hover:bg-stone-700 p-2 rounded transition-all hover:scale-105"
        onClick={onPredictToggle}
        title="Predecir movimiento"
      >
        {movementPrediction ? <IconComponents size={20} /> : <IconComponentsOff size={20} />}
      </button>
    </div>
  );
}

function DisplayOptionsPopover() {
  const { displayOptions, updateDisplayOptions } = useSimulationStore();

  const handleToggleOption = (category: keyof typeof displayOptions, option?: string) => {
    if (option && typeof displayOptions[category] === 'object') {
      updateDisplayOptions({
        [category]: {
          ...displayOptions[category] as object,
          [option]: !(displayOptions[category] as any)[option]
        }
      });
    } else {
      updateDisplayOptions({
        [category]: !displayOptions[category]
      });
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="text-stone-300 hover:text-white hover:bg-stone-700 p-2 rounded transition-all hover:scale-105">
          <IconSettings size={20} />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-56 bg-stone-800 border-stone-700" align="end">
        <div className="space-y-3">
          <div>
            <h4 className="text-xs text-stone-400 mb-2">Posición</h4>
            <div className="space-y-1">
              <Button
                variant="ghost"
                size="sm"
                className={`w-full justify-start text-xs h-7 ${
                  displayOptions.position.resultant 
                    ? 'bg-stone-700 text-white' 
                    : 'text-stone-300 hover:text-white hover:bg-stone-700'
                }`}
                onClick={() => handleToggleOption('position', 'resultant')}
              >
                Resultante
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={`w-full justify-start text-xs h-7 ${
                  displayOptions.position.components 
                    ? 'bg-stone-700 text-white' 
                    : 'text-stone-300 hover:text-white hover:bg-stone-700'
                }`}
                onClick={() => handleToggleOption('position', 'components')}
              >
                Componentes
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={`w-full justify-start text-xs h-7 ${
                  displayOptions.position.angle 
                    ? 'bg-stone-700 text-white' 
                    : 'text-stone-300 hover:text-white hover:bg-stone-700'
                }`}
                onClick={() => handleToggleOption('position', 'angle')}
              >
                Ángulo
              </Button>
            </div>
          </div>

          <Separator className="bg-stone-600" />

          <div>
            <h4 className="text-xs text-stone-400 mb-2">Velocidad</h4>
            <div className="space-y-1">
              <Button
                variant="ghost"
                size="sm"
                className={`w-full justify-start text-xs h-7 ${
                  displayOptions.velocity.resultant 
                    ? 'bg-stone-700 text-white' 
                    : 'text-stone-300 hover:text-white hover:bg-stone-700'
                }`}
                onClick={() => handleToggleOption('velocity', 'resultant')}
              >
                Resultante
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={`w-full justify-start text-xs h-7 ${
                  displayOptions.velocity.components 
                    ? 'bg-stone-700 text-white' 
                    : 'text-stone-300 hover:text-white hover:bg-stone-700'
                }`}
                onClick={() => handleToggleOption('velocity', 'components')}
              >
                Componentes
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={`w-full justify-start text-xs h-7 ${
                  displayOptions.velocity.angle 
                    ? 'bg-stone-700 text-white' 
                    : 'text-stone-300 hover:text-white hover:bg-stone-700'
                }`}
                onClick={() => handleToggleOption('velocity', 'angle')}
              >
                Ángulo
              </Button>
            </div>
          </div>

          <Separator className="bg-stone-600" />

          <div>
            <h4 className="text-xs text-stone-400 mb-2">Aceleración</h4>
            <div className="space-y-1">
              <Button
                variant="ghost"
                size="sm"
                className={`w-full justify-start text-xs h-7 ${
                  displayOptions.acceleration.resultant 
                    ? 'bg-stone-700 text-white' 
                    : 'text-stone-300 hover:text-white hover:bg-stone-700'
                }`}
                onClick={() => handleToggleOption('acceleration', 'resultant')}
              >
                Resultante
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={`w-full justify-start text-xs h-7 ${
                  displayOptions.acceleration.components 
                    ? 'bg-stone-700 text-white' 
                    : 'text-stone-300 hover:text-white hover:bg-stone-700'
                }`}
                onClick={() => handleToggleOption('acceleration', 'components')}
              >
                Componentes
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={`w-full justify-start text-xs h-7 ${
                  displayOptions.acceleration.angle 
                    ? 'bg-stone-700 text-white' 
                    : 'text-stone-300 hover:text-white hover:bg-stone-700'
                }`}
                onClick={() => handleToggleOption('acceleration', 'angle')}
              >
                Ángulo
              </Button>
            </div>
          </div>

          <Separator className="bg-stone-600" />

          <div className="space-y-1">
            <Button
              variant="ghost"
              size="sm"
              className={`w-full justify-start text-xs h-7 ${
                displayOptions.trayectories 
                  ? 'bg-stone-700 text-white' 
                  : 'text-stone-300 hover:text-white hover:bg-stone-700'
              }`}
              onClick={() => handleToggleOption('trayectories')}
            >
              Trayectorias
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`w-full justify-start text-xs h-7 ${
                displayOptions.coordinates 
                  ? 'bg-stone-700 text-white' 
                  : 'text-stone-300 hover:text-white hover:bg-stone-700'
              }`}
              onClick={() => handleToggleOption('coordinates')}
            >
              Coordenadas
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`w-full justify-start text-xs h-7 ${
                displayOptions.axes 
                  ? 'bg-stone-700 text-white' 
                  : 'text-stone-300 hover:text-white hover:bg-stone-700'
              }`}
              onClick={() => handleToggleOption('axes')}
            >
              Ejes
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

function TimeControls() {
  const {
    time, 
    speed, 
    isPlaying, 
    movementPrediction,
    updateTime,
    updateIsInputTimeChanged,
  } = useSimulationStore();

  const [speedInput, setSpeedInput] = useState(() => speed.toFixed(1));

  const {
    handlePlayPause,
    handleSpeedChange,
    handleReset,
    handleSpeedInput,
    handleSpeedBlur,
    handleMovementPredictionToggle,
  } = useTimeHandlers(setSpeedInput);

  return (
    <div className="flex flex-row w-fit h-fit bg-stone-800/90 border border-stone-700 items-center justify-center p-3 gap-3 rounded-lg backdrop-blur-md shadow-lg">
      <TimeInput
        time={time}
        onTimeChange={updateTime}
        onTimeInputToggle={updateIsInputTimeChanged}
        onPredictToggle={handleMovementPredictionToggle}
        movementPrediction={movementPrediction}
      />
      <div className="h-6 w-px bg-stone-600" />
      <SpeedInput
        speed={speed}
        inputValue={speedInput}
        onIncrement={() => handleSpeedChange(speed + 0.1)}
        onDecrement={() => handleSpeedChange(speed - 0.1)}
        onInput={handleSpeedInput}
        onBlur={handleSpeedBlur}
      />
      <div className="h-6 w-px bg-stone-600" />
      <DisplayOptionsPopover />
      <div className="h-6 w-px bg-stone-600" />
      <PlayerButtons
        isPlaying={isPlaying}
        onPlayPause={handlePlayPause}
        onReset={handleReset}
      />
    </div>
  );
}

export default TimeControls;