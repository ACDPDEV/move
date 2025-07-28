'use client';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { useEntitySummaries } from '../hooks/useEntityISummaries';
import EntityCard from './EntityCard';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import { useEntityStore } from '../store/useEntityStore';

function FloatBar() {
    const entities = useEntitySummaries();

    return (
        <div className="flex flex-row gap-1 bg-stone-200/90 dark:bg-stone-800/90 text-stone-900 dark:text-white px-3 py-1.5 rounded-lg text-sm backdrop-blur-sm w-fit flex-wrap justify-center items-center">
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
                        <EntityCard entityId={id} color={color} />
                    </PopoverContent>
                </Popover>
            ))}
            <Button
                onClick={() => useEntityStore.getState().addEntity()}
                size="icon"
                variant="outline"
                className="rounded-full"
            >
                <PlusIcon size={16} />
            </Button>
        </div>
    );
}

export default FloatBar;
