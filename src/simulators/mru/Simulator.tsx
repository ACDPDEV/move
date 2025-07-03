import { useCallback, useState } from "preact/hooks";
import Sidebar from "@/simulators/mru/components/Sidebar";
import TimeControls from "@/simulators/mru/components/TimeControls";
import { SimulationProvider, useSimulation } from "@/simulators/mru/context/SimulationContext";
import { Movil } from "@/simulators/mru/entities/Movil";
import { useDraw } from "@/simulators/mru/hooks/useDraw"
import { Canvas } from "@/components/simulators-renderer/Canvas";

function MRUSimulatorContainer({ slug }: { slug: string }) {
    return (
        <SimulationProvider>
            <MRUSimulator slug={slug} />
        </SimulationProvider>
    );
}

function MRUSimulator({ slug }: { slug: string }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const { 
        state: { isPlaying, entities, time, fps, speed },
        play, 
        pause, 
        setSpeed, 
        updateTime, 
        updateFPS, 
        updateEntities,
        updateEntity,
        resetSimulation
    } = useSimulation();
    
    const draw = useDraw(updateFPS, entities, updateTime, speed, isPlaying);

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
                        FPS: {Math.round(fps)}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MRUSimulatorContainer;