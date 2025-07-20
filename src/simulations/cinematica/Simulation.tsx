'use client';

import { useCallback, useEffect, useState } from "react";
import Sidebar from "@/simulations/cinematica/components/Sidebar";
import TimeControls from "@/simulations/cinematica/components/TimeControls";
import { Movil } from "@/simulations/cinematica/entities/Movil";
import Canvas from "@/simulations/cinematica/components/Canvas";
import { useSimulationStore } from "./store/useSimulationStore";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import MobileForm from "./components/MobileForm";

export default function CinematicaSimulation() {
  // Solo render en cliente para evitar errores de hidratación
  const [isClient, setIsClient] = useState(false);
  useEffect(() => { setIsClient(true); }, []);

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
    updateEntities(entities.filter(e => e.id !== id));
  }, [entities, updateEntities]);

  if (!isClient) return null;

  return (
    <div className="relative w-full h-full bg-stone-900">
      {/* Canvas principal */}
      <Canvas style={{ width: '100%', height: '100%' }} />

      {/* Sidebar */}
      <Sidebar />

      {/* Indicadores de estado */}
      <div className="absolute top-4 left-4 space-y-2">
        <div className="bg-stone-800/90 text-white px-3 py-1.5 rounded-lg text-sm backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-green-400' : 'bg-red-400'}`} />
            {isPlaying ? 'Reproduciendo' : 'Pausado'}
          </div>
        </div>
        <div className="bg-stone-800/90 text-white px-3 py-1.5 rounded-lg text-sm backdrop-blur-sm">
          <div className="font-mono">FPS: {Math.round(fps)}</div>
        </div>
      </div>

      {/* Botones de entidades con Popover */}
      <div className="absolute flex flex-col bottom-0 left-1/2 translate-x-[-50%] gap-2 mb-10 justify-center items-center">
        <div className="flex flex-row gap-1 bg-stone-800/90 text-white px-3 py-1.5 rounded-lg text-sm backdrop-blur-sm w-fit">
          {entities.map(entity => (
            <Popover key={entity.id}>
              {/* Este botón abre el popover al hacer clic */}
              <PopoverTrigger asChild>
                <button
                  className="w-5 h-5 rounded-full"
                  style={{ backgroundColor: entity.color || "#ccc" }}
                  aria-label={`Editar entidad ${entity.id}`}
                />
              </PopoverTrigger>

              {/* Contenido del popover: formulario de la entidad */}
              <PopoverContent className="w-sm p-0">
                <MobileForm
                  entity={entity}
                />
              </PopoverContent>
            </Popover>
          ))}
        </div>
        <TimeControls />
      </div>
    </div>
  );
}
