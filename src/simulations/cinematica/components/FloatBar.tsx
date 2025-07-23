'use client';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { useEntityStore } from '@/simulations/cinematica/store/useEntityStore';
import EntityCard from './EntityCard';

function FloatBar() {
    const { entities } = useEntityStore();

    return (
        <div className="flex flex-row gap-1 bg-stone-800/90 text-white px-3 py-1.5 rounded-lg text-sm backdrop-blur-sm w-fit">
            {entities.map((entity) => (
                <Popover key={entity.id}>
                    {/* Este botón abre el popover al hacer clic */}
                    <PopoverTrigger asChild>
                        <button
                            className="w-5 h-5 rounded-full"
                            style={{ backgroundColor: entity.color || '#ccc' }}
                            aria-label={`Editar entidad`}
                        />
                    </PopoverTrigger>

                    {/* Contenido del popover: formulario de la entidad */}
                    <PopoverContent className="w-sm p-0">
                        <EntityCard entity={entity} />
                    </PopoverContent>
                </Popover>
            ))}
        </div>
    );
}

export default FloatBar;
