'use client';
import { useCallback, useState } from "react";
import Sidebar from "@/simulations/cinematica/components/Sidebar";
import TimeControls from "@/simulations/cinematica/components/TimeControls";
import { Movil } from "@/simulations/cinematica/entities/Movil";
import Canvas from "@/simulations/cinematica/components/Canvas";
import { useSimulationStore } from "./store/useSimulationStore";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from "@/components/ui/button";
import { IconLayoutSidebarLeftCollapseFilled } from "@tabler/icons-react";

function CinematicaSimulation() {

    const { 
        isPlaying,
        entities,
        fps,
        updateEntities,
        updateEntity,
    } = useSimulationStore();

    
    
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
            
            <Sidebar />
            
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

            <div className="absolute flex flex-col bottom-0 left-1/2 translate-x-[-50%] gap-2 mb-10 justify-center items-center">
                <div className="flex flex-row gap-1 bg-stone-800/90 text-white px-3 py-1.5 rounded-lg text-sm backdrop-blur-sm w-fit">
                    {
                        entities.map(entity => (
                            <button
                                key={entity.id}
                                className="w-5 h-5 rounded-full"
                                style={{ backgroundColor: entity.color }}
                            />
                        ))
                    }
                </div>
                <TimeControls />
            </div>
        </div>
    );
}

export default CinematicaSimulation;