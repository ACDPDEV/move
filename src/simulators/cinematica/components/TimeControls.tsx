
import { useState, useEffect } from 'preact/hooks';
import { IconEye, IconEyeOff, IconPlayerPause, IconPlayerPlay, IconReload } from '@tabler/icons-preact';
import { useSimulation } from '@/simulators/cinematica/context/SimulationContext';

interface TimeControlsProps {
    isPlaying: boolean;
    time: number;
    speed: number;
    onPlayPause: () => void;
    onStep: () => void;
    onReset: () => void;
    onSpeedChange: (speed: number) => void;
    onSpeedUp: () => void;
    onSpeedDown: () => void;
}

/**
 * Componente de controles de tiempo para la simulación
 * Proporciona botones para play/pause, reset, step, y control de velocidad
 */
function TimeControls({
    isPlaying,
    time,
    speed,
    onPlayPause,
    onStep,
    onReset,
    onSpeedChange,
    onSpeedUp,
    onSpeedDown
}: TimeControlsProps) {

    const { state: { showVectors }, setShowVectors } = useSimulation();

    // Estado local para el input de velocidad
    const [speedInput, setSpeedInput] = useState<string>(() => speed.toFixed(1));

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
            onSpeedChange(newSpeed);
        } else {
            setSpeedInput(speed.toFixed(1)); // Restaura valor válido
        }
    };

    const handleShowVectorsChange = () => {
        setShowVectors(!showVectors);
    };

    return (
        <div class="absolute flex flex-row bottom-0 left-1/2 translate-x-[-50%] w-fit h-fit bg-stone-800/90 border border-stone-700 items-center justify-center p-3 gap-3 rounded-lg mb-10 backdrop-blur-md shadow-lg">
            {/* Indicador de tiempo */}
            <div class="flex items-center gap-2">
                <span class="text-xs text-stone-400">Tiempo:</span>
                <span class="text-sm text-stone-200 font-mono bg-stone-700 px-2 py-1 rounded">
                    {time.toFixed(2)}s
                </span>
            </div>
            
            <div class="h-6 w-px bg-stone-600"></div>
            
            {/* Controles de velocidad */}
            <div class="flex items-center gap-2">
                <span class="text-xs text-stone-400">Velocidad:</span>
                <button 
                    onClick={onSpeedDown}
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
                
                <span class="text-xs text-stone-400">x</span>
                
                <button 
                    onClick={onSpeedUp}
                    class="text-stone-400 hover:text-white hover:bg-stone-700 w-6 h-6 rounded flex items-center justify-center transition-colors"
                    title="Aumentar velocidad"
                    disabled={speed >= 3}
                >
                    +
                </button>
            </div>
            
            <div class="h-6 w-px bg-stone-600"></div>
            
            {/* Controles de reproducción */}
            <div class="flex items-center gap-2">
                <button 
                    class="text-stone-300 hover:text-white hover:bg-stone-700 p-2 rounded transition-all hover:scale-105" 
                    onClick={handleShowVectorsChange}
                    title="{showVectors ? 'Ocultar' : 'Mostrar'} vectores"
                >
                    {showVectors ? <IconEye size={20} /> : <IconEyeOff size={20} />}
                </button>
                
                <button 
                    class="text-stone-300 hover:text-white hover:bg-stone-700 p-2 rounded transition-all hover:scale-105" 
                    onClick={onPlayPause}
                    title={isPlaying ? 'Pausar' : 'Reproducir'}
                >
                    {isPlaying ? <IconPlayerPause size={20} /> : <IconPlayerPlay size={20} />}
                </button>
                
                <button 
                    class="text-stone-300 hover:text-white hover:bg-stone-700 p-2 rounded transition-all hover:scale-105" 
                    onClick={onReset}
                    title="Reiniciar simulación"
                >
                    <IconReload size={20} />
                </button>
            </div>
        </div>
    );
}

export default TimeControls;