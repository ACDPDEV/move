'use client';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useEntitySummaries } from '../hooks/useEntityISummaries';
import EntityCard from './EntityCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import EntityCharts from './EntityCharts';
import TimeInput from './inputs/TimeInput';
import { useState } from 'react';
import { toast } from 'sonner';
import MovementPredictionToggle from './buttons/MovementPredictionToggle';
import { Separator } from '@/components/ui/separator';
import PlayerToggle from './buttons/PlayerToogle';
import ResetButton from './buttons/ResetButton';
import { ModeToggle } from '@/components/layout/ToogleTheme';
import DisplayOptionsSelector from './selector/DisplayOptionsSelector';
import TimeSpeedSelector from './selector/TimeSpeedSelector';
import { Popover, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import {
    IconArrowUp,
    IconChartArea,
    IconLayoutSidebarLeftExpandFilled,
    IconMeteorFilled,
    IconPlus,
} from '@tabler/icons-react';
import { PopoverContent } from '@radix-ui/react-popover';
import { useSidebarStore } from '../stores/useSidebarStore';
import { useEntityStore } from '../stores/useEntityStore';

function SimulationSidebar({
    className,
    isOpen,
}: {
    className?: string;
    isOpen: boolean;
}) {
    const toggleIsOpen = useSidebarStore((s) => s.toggleIsOpen);
    const entities = useEntitySummaries();
    const reversed = [...entities].reverse();
    const [error, setError] = useState<string>('');

    if (error) {
        toast.error(error);
    }

    return (
        <div
            className={`${
                isOpen ? 'w-md' : 'w-0 hidden'
            } transition-all duration-300 h-full overflow-hidden ${
                className ?? ''
            }`}
        >
            <Tabs
                defaultValue="entities"
                className="grid grid-rows-[auto_1fr_auto] h-full bg-stone-200 dark:bg-stone-800 text-stone-900 dark:text-white"
            >
                <div className="flex flex-row p-2 pb-0 justify-between items-center">
                    <TabsList className="row-start-1 flex bg-stone-300 dark:bg-stone-700">
                        <TabsTrigger value="entities">
                            <IconMeteorFilled />
                            Móviles
                        </TabsTrigger>
                        <TabsTrigger value="charts">
                            <IconChartArea /> Gráficas
                        </TabsTrigger>
                    </TabsList>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={toggleIsOpen}
                    >
                        <IconLayoutSidebarLeftExpandFilled size={20} />
                    </Button>
                </div>

                <TabsContent
                    value="entities"
                    className="row-start-2 h-full overflow-hidden"
                >
                    <ScrollArea className="w-full h-full">
                        <div className="flex flex-col gap-4 p-4">
                            <Button
                                variant="default"
                                className="w-full justify-center text-left hover:border hover:border-bg-secondary"
                                onClick={() =>
                                    useEntityStore.getState().addEntity()
                                }
                            >
                                <IconPlus size={20} />
                                Añadir Móvil
                            </Button>
                            {reversed.map(({ id, color }) => (
                                <EntityCard
                                    entityId={id}
                                    color={color}
                                    key={id}
                                />
                            ))}
                        </div>
                    </ScrollArea>
                </TabsContent>

                <TabsContent
                    value="charts"
                    className="row-start-2 h-full overflow-hidden"
                >
                    <ScrollArea className="w-full h-full">
                        <div className="flex flex-col gap-4 p-4">
                            {reversed.map(({ id, color }) => (
                                <EntityCharts
                                    entityId={id}
                                    color={color}
                                    key={id}
                                />
                            ))}
                        </div>
                    </ScrollArea>
                </TabsContent>

                {/* Fila 3: Footer */}
                <footer className="row-start-3 p-4 border-t flex flex-row items-center justify-center gap-3">
                    <div className="flex items-center gap-2">
                        <MovementPredictionToggle />
                        <TimeInput setError={setError} />
                        <PlayerToggle />
                        <ResetButton />
                        <TimeSpeedSelector setError={setError} />
                    </div>
                    <Separator
                        orientation="vertical"
                        className="h-6 bg-stone-600"
                    />
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" size="icon">
                                <IconArrowUp size={20} />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-fit h-fit flex flex-col gap-2 p-2 justify-center items-center bg-stone-200 dark:bg-stone-800 text-stone-900 dark:text-stone-100">
                            <DisplayOptionsSelector />
                            <ModeToggle />
                        </PopoverContent>
                    </Popover>
                </footer>
            </Tabs>
        </div>
    );
}

export default SimulationSidebar;
