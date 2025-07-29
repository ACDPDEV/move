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
import { useEntityStore } from '../stores/useEntityStore';
import { ScrollArea } from '@radix-ui/react-scroll-area';
import {
    IconCircleFilled,
    IconSquareFilled,
    IconTriangleFilled,
} from '@tabler/icons-react';

function FloatBar({
    orientation = 'horizontal',
}: {
    orientation?: 'horizontal' | 'vertical';
}) {
    const entities = useEntitySummaries();
    const reversedEntities = [...entities].reverse();

    return (
        <div
            className={`flex ${
                orientation === 'horizontal'
                    ? 'flex-row w-96 h-fit'
                    : 'flex-col w-fit h-96'
            } gap-1 bg-stone-200/90 dark:bg-stone-800/90 text-stone-900 dark:text-white px-3 py-1.5 rounded-lg text-sm backdrop-blur-sm flex-wrap justify-start items-center`}
        >
            <Button
                onClick={() => useEntityStore.getState().addEntity()}
                size="icon"
                variant="outline"
                className="rounded-full"
            >
                <PlusIcon size={16} />
            </Button>
            <ScrollArea className="w-full h-full flex-1 overflow-x-auto">
                <div
                    className={`flex ${
                        orientation === 'horizontal' ? 'flex-row' : 'flex-col'
                    } gap-1 w-fit h-fit justify-start items-center`}
                >
                    {reversedEntities.map(({ id, color, shape }) => {
                        return (
                            <Popover key={id}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="w-5 h-5"
                                    >
                                        {shape === 'circle' ? (
                                            <IconCircleFilled
                                                color={color}
                                                size={16}
                                            />
                                        ) : shape === 'square' ? (
                                            <IconSquareFilled
                                                color={color}
                                                size={16}
                                            />
                                        ) : (
                                            <IconTriangleFilled
                                                color={color}
                                                size={16}
                                            />
                                        )}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-sm p-0">
                                    <EntityCard entityId={id} color={color} />
                                </PopoverContent>
                            </Popover>
                        );
                    })}
                </div>
            </ScrollArea>
        </div>
    );
}

export default FloatBar;
