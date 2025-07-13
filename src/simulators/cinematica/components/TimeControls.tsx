import { useState } from 'preact/hooks';
import { IconEye, IconEyeOff, IconPlayerPause, IconPlayerPlay, IconReload, IconComponents, IconComponentsOff } from '@tabler/icons-preact';
import { useSimulation } from '@/simulators/cinematica/context/SimulationContext';
import { useTimeHandlers } from '@/simulators/cinematica/hooks/useTimeHadlers';

function PlayerButtons({isPlaying, HandlePlayPause, handleReset, showVectors, handleShowVectorsChange }: {
    isPlaying: boolean,
    HandlePlayPause: () => void,
    handleReset: () => void,
    showVectors: boolean,
    handleShowVectorsChange: () => void
}) {
    return (
        <div class="flex items-center gap-2">
            <button 
                class="text-stone-300 hover:text-white hover:bg-stone-700 p-2 rounded transition-all hover:scale-105" 
                onClick={handleShowVectorsChange}
                title={showVectors ? 'Ocultar vectores' : 'Mostrar vectores'}
            >
                {showVectors ? <IconEye size={20} /> : <IconEyeOff size={20} />}
            </button>
            <button 
                class="text-stone-300 hover:text-white hover:bg-stone-700 p-2 rounded transition-all hover:scale-105" 
                onClick={HandlePlayPause}
                title={isPlaying ? 'Pausar' : 'Reproducir'}
            >
                {isPlaying ? <IconPlayerPause size={20} /> : <IconPlayerPlay size={20} />}
            </button>
            <button 
                class="text-stone-300 hover:text-white hover:bg-stone-700 p-2 rounded transition-all hover:scale-105" 
                onClick={handleReset}
                title="Reiniciar simulación"
            >
                <IconReload size={20} />
            </button>
        </div>
    );
}

function SpeedInput({handleSpeedChange, handleSpeedInput, handleSpeedBlur, speed, speedInput }:{
    handleSpeedChange: (speed: number) => void,
    handleSpeedInput: (event: Event) => void, 
    handleSpeedBlur: (event: Event) => void, 
    speed: number,
    speedInput: string,
}) {
    return (
        <div class="flex items-center gap-2">
            <span class="text-xs text-stone-400">Velocidad:</span>
            <button 
                onClick={() => handleSpeedChange(speed - 0.1)}
                class="text-stone-400 hover:text-white hover:bg-stone-700 w-6 h-6 rounded flex items-center justify-center transition-colors"
                title="Disminuir velocidad"
                disabled={speed <= 0.1}
            >
                -
            </button>
            <input
                type="number"
                min="0.1"
                max="3"
                step="0.1"
                value={speedInput}
                onInput={handleSpeedInput}
                onBlur={handleSpeedBlur}
                class="w-12 text-center text-sm text-stone-200 bg-stone-700 border border-stone-600 rounded px-1 py-0.5 focus:outline-none focus:border-stone-500 [&::-webkit-inner-spin-button]:hidden"
            />
            
            <button 
                onClick={() => handleSpeedChange(speed + 0.1)}
                class="text-stone-400 hover:text-white hover:bg-stone-700 w-6 h-6 rounded flex items-center justify-center transition-colors"
                title="Aumentar velocidad"
                disabled={speed >= 3}
            >
                +
            </button>
        </div>
    );
}

function TimeInput({ time, updateTime, updateIsInputTimeChanged, handleMovementPrediction, movementPrediction }: {
    time: number,
    updateTime: (newTime: number) => void,
    updateIsInputTimeChanged: (changed: boolean) => void,
    handleMovementPrediction: () => void,
    movementPrediction: boolean,
}) {
    return (
        <div class="flex items-center gap-2">
            <span class="text-xs text-stone-400">Tiempo:</span>
            <input
                type="number"
                value={time.toFixed(2)}
                onInput={(e) => {
                    const newTime = parseFloat((e.target as HTMLInputElement).value);
                    if (isNaN(newTime)) return;
                    updateIsInputTimeChanged(true);
                    updateTime(newTime);
                }}
                class="w-20 text-center text-sm text-stone-200 bg-stone-700 border border-stone-600 rounded px-1 py-0.5 focus:outline-none focus:border-stone-500 [&::-webkit-inner-spin-button]:hidden"
            />
            <button
                class="text-stone-300 hover:text-white hover:bg-stone-700 p-2 rounded transition-all hover:scale-105" 
                onClick={handleMovementPrediction}
                title='Predecir el movimiento con el tiempo'
            >
                {movementPrediction ? <IconComponents size={20} /> : <IconComponentsOff size={20} />}
            </button>
        </div>
    );
}

function TimeControls() {
    const { 
        state: { time, speed, isPlaying, showVectors, movementPrediction },
        updateTime,
        updateIsInputTimeChanged,
    } = useSimulation(); 

    // Estado local para el input de velocidad
    const [speedInput, setSpeedInput] = useState<string>(() => speed.toFixed(1));

    const { 
        handlePlayPause,
        handleSpeedChange,
        handleReset,
        handleSpeedInput,
        handleSpeedBlur,
        handleShowVectorsChange,
        handleMovementPrediction,
    } = useTimeHandlers(setSpeedInput);

    return (
        <div class="absolute flex flex-row bottom-0 left-1/2 translate-x-[-50%] w-fit h-fit bg-stone-800/90 border border-stone-700 items-center justify-center p-3 gap-3 rounded-lg mb-10 backdrop-blur-md shadow-lg">
            <TimeInput
                time={time}
                updateTime={updateTime}
                updateIsInputTimeChanged={updateIsInputTimeChanged}
                handleMovementPrediction={handleMovementPrediction}
                movementPrediction={movementPrediction}
            />
            
            <div class="h-6 w-px bg-stone-600"></div>
            
            <SpeedInput
                handleSpeedChange={handleSpeedChange}
                handleSpeedInput={handleSpeedInput}
                handleSpeedBlur={handleSpeedBlur}
                speed={speed}
                speedInput={speedInput}
            />
            
            <div class="h-6 w-px bg-stone-600"></div>
            
            <PlayerButtons 
                isPlaying={isPlaying}
                HandlePlayPause={handlePlayPause}
                handleReset={handleReset}
                showVectors={showVectors}
                handleShowVectorsChange={handleShowVectorsChange}
            />
        </div>
    );
}

export default TimeControls;