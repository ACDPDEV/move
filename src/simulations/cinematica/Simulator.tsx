import { useCallback, useState } from "preact/hooks";
import Sidebar from "@/simulations/cinematica/components/Sidebar";
import TimeControls from "@/simulations/cinematica/components/TimeControls";
import { SimulationProvider, useSimulation } from "@/simulations/cinematica/context/SimulationContext";
import { Movil } from "@/simulations/cinematica/entities/Movil";
import Canvas from "@/simulations/cinematica/components/Canvas";

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
        state: { isPlaying, entities, fps },
        updateEntities,
        updateEntity,
    } = useSimulation();

    
    
    const handleEntityChange = useCallback((id: string, updates: Partial<Movil>) => {
        updateEntity(id, updates);
    }, [updateEntity]);

    const handleEntityDelete = useCallback((id: string) => {
        const filteredEntities = entities.filter(entity => entity.id !== id);
        updateEntities(filteredEntities);
    }, [entities, updateEntities]);


    return (
        <div className="relative w-full h-full bg-stone-900">
            <Canvas style={{ width: '100%', height: '100%' }} />
            
            <TimeControls />
            
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

            <div className="absolute bottom-4 right-4 space-y-2">
                <div class="flex flex-row gap-1 bg-stone-800/90 text-white px-3 py-1.5 rounded-lg text-sm backdrop-blur-sm">
                    {
                        entities.map(entity => (
                            <button
                                key={entity.id}
                                class="w-5 h-5 rounded-full"
                                style={{ backgroundColor: entity.color }}
                            />
                        ))
                    }
                </div>
            </div>
        </div>
    );
}

export default MRUSimulatorContainer;