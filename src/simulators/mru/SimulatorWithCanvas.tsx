import { useRef, useCallback, useState } from "preact/hooks";
import type { RefObject } from "preact";
import { Canvas } from "@/components/simulators-renderer/Canvas";
import TimeControls from "@/simulators/mru/components/TimeControls";
import Sidebar from "@/simulators/mru/components/Sidebar";
import { useSimulation } from "@/simulators/mru/context/SimulationContext";
import { Movil } from "./entities/Movil";

function useDraw(
    updateFPS: (fps: number) => void,
    updateEntities: (entities: Movil[]) => void,
    updateTime: (time: number) => void
) {
    
    const lastTimeRef = useRef<number>(0);
    const counterRef = useRef<number>(0);
    const fpsRef = useRef<number>(0);
    const frameCountRef = useRef<number>(0);
    const lastFpsUpdateRef = useRef<number>(0);

    return useCallback((ctx: CanvasRenderingContext2D, frameCount: number) => {
        const canvas = ctx.canvas;
        const now = performance.now();
        const deltaTime = now - (lastTimeRef.current || now - 16); // Default to 60fps on first frame
        lastTimeRef.current = now;
        
        // Update FPS counter every second
        frameCountRef.current++;
        if (now - lastFpsUpdateRef.current > 1000) {
            fpsRef.current = Math.round((frameCountRef.current * 1000) / (now - lastFpsUpdateRef.current));
            frameCountRef.current = 0;
            lastFpsUpdateRef.current = now;
        }
        
        // Update counter based on delta time (counts up by 1 every second)
        counterRef.current += deltaTime / 1000;
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw background
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw counter and FPS
        ctx.fillStyle = 'white';
        ctx.font = '20px Arial';
        ctx.fillText(`Counter: ${counterRef.current.toFixed(2)}`, 20, 30);
        ctx.fillText(`FPS: ${fpsRef.current}`, 20, 60);
        ctx.fillText(`Delta: ${deltaTime.toFixed(2)}ms`, 20, 90);

        // Update states
        updateFPS(fpsRef.current);
        updateTime(counterRef.current);
    }, []);
}

function MRUSimulatorWithCanvas() {

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
    
    const draw = useDraw(updateFPS, updateEntities, updateTime);

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
    
    const handleStep = useCallback(() => {
        if (isPlaying) return;
    }, [isPlaying]);
    
    const handleEntityChange = useCallback((id: string, updates: Partial<Movil>) => {
        updateEntity(id, updates);
    }, [updateEntity]);

    const handleEntityDelete = useCallback((id: string) => {
        const filteredEntities = entities.filter(entity => entity.id !== id);
        updateEntities(filteredEntities);
    }, [entities, updateEntities]);


    return (
        <div className="relative w-full h-full bg-stone-900">
            <Canvas draw={draw} style={{ width: '100%', height: '100%' }} />
            
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
            
            <Sidebar
                isOpen={isSidebarOpen}
                onToggle={() => setIsSidebarOpen(prev => !prev)}
                entities={entities}
                onEntityChange={handleEntityChange}
                onEntityDelete={handleEntityDelete}
            />
            
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
                
                <div className="bg-green-600/90 text-white px-3 py-1.5 rounded-lg text-sm backdrop-blur-sm">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-white rounded-full" />
                        Sistema listo
                    </div>
                </div>
            </div>
        </div>
    );
}

export { MRUSimulatorWithCanvas };