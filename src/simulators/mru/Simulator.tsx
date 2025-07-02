import { useCallback, useState, useRef } from "preact/hooks";
import { setup, preload, loop, cleanup } from "@/simulators/mru/draw";
import { usePixiApp } from "@/hooks/usePixiApp";
import Sidebar from "./components/Sidebar";
import TimeControls from "./components/TimeControls";
import { SimulationProvider, useSimulation } from "./context/SimulationContext";
import { Movil } from "./entities/Movil";
import { MRUSimulatorWithCanvas } from "@/simulators/mru/SimulatorWithCanvas";

/**
 * Contenedor principal que envuelve el simulador con el contexto
 */
function MRUSimulatorContainer({ slug }: { slug: string }) {
    return (
        <SimulationProvider>
            <MRUSimulatorWithCanvas />
        </SimulationProvider>
    );
}

/**
 * Componente principal de la simulación MRU/MRUV completamente refactorizado
 * Utiliza el hook usePixiApp personalizado para toda la gestión de PixiJS
 */
function MRUSimulator({ slug }: { slug: string }) {
    // Estado local del componente
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Referencias para elementos del DOM
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Contexto de simulación
    const { 
        state: { isPlaying, entities, time, fps, speed },
        actions: {
            play, 
            pause, 
            setSpeed, 
            updateTime, 
            updateFPS, 
            updateEntities,
            updateEntity,
            resetSimulation
        }
    } = useSimulation();

    // Hook usePixiApp con configuración completa
    const { appRef, isReady, timeRef, restart, step: pixiStep } = usePixiApp({
        setup,
        preload,
        loop,
        canvasRef,
        containerRef,
        entities,
        updateEntities,
        isPlaying,
        speed,
        onTimeUpdate: updateTime,
        onFPSUpdate: updateFPS
    });

    /**
     * Maneja el play/pause de la simulación
     */
    const handlePlayPause = useCallback(() => {
        if (isPlaying) {
            pause();
        } else {
            play();
        }
    }, [isPlaying, play, pause]);

    /**
     * Maneja el cambio de velocidad
     */
    const handleSpeedChange = useCallback((newSpeed: number) => {
        const clampedSpeed = Math.max(0.1, Math.min(3, newSpeed));
        setSpeed(clampedSpeed);
    }, [setSpeed]);

    /**
     * Reinicia la simulación completamente
     */
    const handleReset = useCallback(() => {
        resetSimulation();
        restart();
    }, [resetSimulation, restart]);

    /**
     * Avanza un paso en la simulación (solo cuando está pausada)
     */
    const handleStep = useCallback(() => {
        if (isPlaying) return; // Solo permitir step cuando está pausado
        pixiStep();
    }, [isPlaying, pixiStep]);

    /**
     * Maneja cambios en las entidades desde el sidebar
     */
    const handleEntityChange = useCallback((id: string, updates: Partial<Movil>) => {
        updateEntity(id, updates);
    }, [updateEntity]);

    /**
     * Maneja la eliminación de entidades
     */
    const handleEntityDelete = useCallback((id: string) => {
        const filteredEntities = entities.filter(entity => entity.id !== id);
        updateEntities(filteredEntities);
    }, [entities, updateEntities]);

    // Renderizar la interfaz
    return (
        <div className="relative w-full h-full bg-stone-900">
            {/* Contenedor de PixiJS */}
            <div ref={containerRef} className="w-full h-full">
                <canvas ref={canvasRef} className="w-full h-full" />
            </div>
            
            {/* Controles de tiempo */}
            <TimeControls
                isPlaying={isPlaying}
                onPlayPause={handlePlayPause}
                onReset={handleReset}
                onStep={handleStep}
                time={time}
                speed={speed}
                onSpeedChange={handleSpeedChange}
                onSpeedUp={() => handleSpeedChange(speed + 0.1)}
                onSpeedDown={() => handleSpeedChange(speed - 0.1)}
            />
            
            {/* Sidebar */}
            <Sidebar
                isOpen={isSidebarOpen}
                onToggle={() => setIsSidebarOpen(prev => !prev)}
                entities={entities}
                onEntityChange={handleEntityChange}
                onEntityDelete={handleEntityDelete}
            />
            
            {/* Indicadores de estado mejorados */}
            <div className="absolute top-4 left-4 space-y-2">
                <div className="bg-stone-800/90 text-white px-3 py-1.5 rounded-lg text-sm backdrop-blur-sm">
                    <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-green-400' : 'bg-red-400'}`} />
                        {isPlaying ? 'Reproduciendo' : 'Pausado'}
                    </div>
                </div>
                
                <div className="bg-stone-800/90 text-white px-3 py-1.5 rounded-lg text-sm backdrop-blur-sm">
                    <div className="font-mono">
                        FPS: {Math.round(fps)} | Tiempo: {time.toFixed(2)}s
                    </div>
                </div>
                
                <div className="bg-stone-800/90 text-white px-3 py-1.5 rounded-lg text-sm backdrop-blur-sm">
                    Velocidad: {speed.toFixed(1)}x | Entidades: {entities.length}
                </div>
                
                {!isReady.current ? (
                    <div className="bg-orange-600/90 text-white px-3 py-1.5 rounded-lg text-sm backdrop-blur-sm animate-pulse">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-white rounded-full animate-ping" />
                            Cargando PixiJS...
                        </div>
                    </div>
                ) : (
                    <div className="bg-green-600/90 text-white px-3 py-1.5 rounded-lg text-sm backdrop-blur-sm">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-white rounded-full" />
                            Sistema listo
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default MRUSimulatorContainer;