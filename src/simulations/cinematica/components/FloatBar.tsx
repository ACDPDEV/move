'use client';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { useEntitySummaries } from '../hooks/useEntityISummaries';
import EntityCard from './EntityCard';
import { Button } from '@/components/ui/button';
import { useEntityStore } from '../stores/useEntityStore';

import {
    IconCircleFilled,
    IconPlus,
    IconSquareFilled,
    IconTriangleFilled,
} from '@tabler/icons-react';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';

function FloatBar({ className }: { className?: string }) {
    const entities = useEntitySummaries();
    const reversedEntities = [...entities].reverse();

    return (
        <div
            className={`
                flex flex-col h-72 gap-1
                bg-stone-200/90 dark:bg-stone-800/90
                text-stone-900 dark:text-white
                px-3 py-1.5 rounded-lg text-sm
                backdrop-blur-sm
                border border-stone-300/50 dark:border-stone-700/50
                shadow-lg
                ${className}
            `}
        >
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        onClick={() => useEntityStore.getState().addEntity()}
                        size="icon"
                        variant="outline"
                        className="rounded-full flex-shrink-0 mb-1 text-stone-700 dark:text-stone-300  dark:hover:bg-stone-700 p-2 transition-all duration-200 hover:scale-125 focus:outline-none focus:ring-2 focus:ring-stone-500"
                    >
                        <IconPlus size={16} />
                    </Button>
                </TooltipTrigger>
                <TooltipContent>Añadir Móvil</TooltipContent>
            </Tooltip>

            <div
                className="
                    flex-1 w-full 
                    overflow-y-auto overflow-x-hidden
                    scrollbar-thin scrollbar-track-transparent scrollbar-thumb-stone-400/50
                    hover:scrollbar-thumb-stone-500/70
                    dark:scrollbar-thumb-stone-600/50
                    dark:hover:scrollbar-thumb-stone-500/70
                "
                style={{
                    scrollbarWidth: 'thin',
                    scrollbarGutter: 'stable',
                }}
            >
                <div className="flex flex-col gap-1 pr-1">
                    {reversedEntities.map(({ id, color, shape }) => (
                        <Popover key={id}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="
                                        w-7 h-7 flex-shrink-0
                                        hover:bg-stone-300/50 dark:hover:bg-stone-700/50
                                        transition-colors duration-200
                                        rounded-md
                                    "
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
                            <PopoverContent
                                className="w-sm p-0"
                                side="left"
                                sideOffset={8}
                            >
                                <EntityCard entityId={id} color={color} />
                            </PopoverContent>
                        </Popover>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default FloatBar;
