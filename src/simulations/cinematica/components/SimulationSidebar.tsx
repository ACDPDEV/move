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
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import {
    IconArrowUp,
    IconChartArea,
    IconLayoutSidebarLeftExpandFilled,
    IconMeteorFilled,
    IconPlus,
} from '@tabler/icons-react';
import { useSidebarStore } from '../stores/useSidebarStore';
import { useEntityStore } from '../stores/useEntityStore';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { AnimatePresence, motion } from 'motion/react';
import { useURL } from '../hooks/useURL';
import { compressData } from '../utils/encodeAndDecodeEntities';

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
    const { setURLParams } = useURL();

    if (error) {
        toast.error(error);
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    key="sidebar"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 50 }}
                    transition={{ duration: 0.2 }}
                    className={`w-full sm:w-[28rem] h-full bg-[#151E19] overflow-hidden ${
                        className ?? ''
                    }`}
                >
                    <Tabs
                        defaultValue="entities"
                        className="grid grid-rows-[auto_1fr_auto] w-full h-full text-stone-900 dark:text-white"
                    >
                        {/* Header */}
                        <div className="flex flex-row p-2 pb-0 justify-between items-center">
                            <TabsList className="flex bg-stone-300 dark:bg-stone-700">
                                <TabsTrigger value="entities">
                                    <IconMeteorFilled />
                                    Móviles
                                </TabsTrigger>
                                <TabsTrigger value="charts">
                                    <IconChartArea /> Gráficas
                                </TabsTrigger>
                            </TabsList>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={toggleIsOpen}
                                        className="text-stone-700 dark:text-stone-300  dark:hover:bg-stone-700 p-2 rounded transition-all duration-200 hover:scale-125 focus:outline-none focus:ring-2 focus:ring-stone-500"
                                    >
                                        <IconLayoutSidebarLeftExpandFilled
                                            size={20}
                                        />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    Cerrar panel lateral
                                </TooltipContent>
                            </Tooltip>
                        </div>

                        {/* Entities */}
                        <TabsContent
                            value="entities"
                            className="row-start-2 w-full h-full overflow-hidden"
                        >
                            <ScrollArea className="w-full h-full">
                                <div className="flex flex-col gap-4 p-4">
                                    <Button
                                        variant="default"
                                        className="w-full justify-center text-left hover:border hover:border-bg-secondary"
                                        onClick={() => {
                                            useEntityStore
                                                .getState()
                                                .addEntity();
                                            setURLParams({
                                                d: compressData(
                                                    useEntityStore.getState()
                                                        .entities,
                                                ),
                                            });
                                        }}
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

                        {/* Charts */}
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

                        {/* Footer */}
                        <footer className="row-start-3 p-4 border-t flex flex-row items-center justify-center gap-3">
                            <div className="flex items-center gap-2">
                                <MovementPredictionToggle />
                                <TimeInput setError={setError} />
                                <PlayerToggle />
                                <ResetButton />
                                <TimeSpeedSelector />
                                <DisplayOptionsSelector />
                            </div>
                        </footer>
                    </Tabs>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export default SimulationSidebar;
