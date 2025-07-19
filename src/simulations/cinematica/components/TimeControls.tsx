import { useState } from 'react';
import {
  IconPlayerPause,
  IconPlayerPlay,
  IconReload,
  IconComponents,
  IconComponentsOff,
  IconArrowUp,
} from '@tabler/icons-react';
import { useTimeHandlers } from '@/simulations/cinematica/hooks/useTimeHandlers';
import { DropdownItem, DropdownMenu, DropdownSeparator } from './DropdownMenu';
import { useSimulationStore } from '../store/useSimulationStore';

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
  onInput: (e: Event) => void;
  onBlur: (e: Event) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-stone-400">Velocidad:</span>
      <button onClick={onDecrement} disabled={speed <= 0.1} className="text-stone-400 hover:text-white hover:bg-stone-700 w-6 h-6 rounded flex items-center justify-center transition-colors" title="Disminuir velocidad">-</button>
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
      <button onClick={onIncrement} disabled={speed >= 3} className="text-stone-400 hover:text-white hover:bg-stone-700 w-6 h-6 rounded flex items-center justify-center transition-colors" title="Aumentar velocidad">+</button>
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

function TimeControls() {
  const {
    time, speed, isPlaying, displayOptions, movementPrediction ,
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
    handleToggleDisplayOption,
    handleMovementPredictionToggle,
  } = useTimeHandlers(setSpeedInput);

  const handleItemClick = (item: string): void => {
    console.log(`Clicked: ${item}`);
    // setIsOpen(false);
  };

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
      <DropdownMenu 
        position="top-left"
        trigger={
          <button className="px-3 py-2 bg-red-500 text-white rounded">
            <IconArrowUp size={20} />
          </button>
        }
      >
        <span className="text-xs text-stone-400">Posición</span>
        <DropdownItem onClick={() => handleItemClick('position-resultant')}>
          Resultante
        </DropdownItem>
        <DropdownItem onClick={() => handleItemClick('position-components')}>
          Componentes
        </DropdownItem>
        <DropdownItem onClick={() => handleItemClick('position-angle')}>
          Ángulo
        </DropdownItem>
        <DropdownSeparator />
        <span className="text-xs text-stone-400">Velocidad</span>
        <DropdownItem onClick={() => handleItemClick('velocity-resultant')}>
          Resultante
        </DropdownItem>
        <DropdownItem onClick={() => handleItemClick('velocity-components')}>
          Componentes
        </DropdownItem>
        <DropdownItem onClick={() => handleItemClick('velocity-angle')}>
          Ángulo
        </DropdownItem>
        <DropdownSeparator />
        <span className="text-xs text-stone-400">Aceleración</span>
        <DropdownItem onClick={() => handleItemClick('acceleration-resultant')}>
          Resultante
        </DropdownItem>
        <DropdownItem onClick={() => handleItemClick('acceleration-components')}>
          Componentes
        </DropdownItem>
        <DropdownItem onClick={() => handleItemClick('acceleration-angle')}>
          Ángulo
        </DropdownItem>
        <DropdownSeparator />
        <DropdownItem onClick={() => handleItemClick('trayectories')}>
          Trayectorias
        </DropdownItem>
        <DropdownItem onClick={() => handleItemClick('coordinates')}>
          Coordenadas
        </DropdownItem>
        <DropdownItem onClick={() => handleItemClick('axes')}>
          Ejes
        </DropdownItem>
      </DropdownMenu>
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