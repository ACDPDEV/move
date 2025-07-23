'use client';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { useEntitySummaries } from '../hooks/useEntityISummaries';
import EntityCard from './EntityCard';

function FloatBar() {
    const entities = useEntitySummaries();

    return (
        <div className="flex flex-row gap-1 bg-stone-800/90 text-white px-3 py-1.5 rounded-lg text-sm backdrop-blur-sm w-fit flex-wrap">
            {entities.map(({ id, color }) => (
                <Popover key={id}>
                    <PopoverTrigger asChild>
                        <button
                            className="w-5 h-5 rounded-full"
                            style={{ backgroundColor: color }}
                            aria-label="Editar entidad"
                        />
                    </PopoverTrigger>
                    <PopoverContent className="w-sm p-0">
                        <EntityCard entityId={id} />
                    </PopoverContent>
                </Popover>
            ))}
        </div>
    );
}

export default FloatBar;
