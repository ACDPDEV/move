'use client';
import TimeControls from '@/simulations/cinematica/components/TimeControls';
import Canvas from '@/simulations/cinematica/components/Canvas';
import FloatBar from './components/FloatBar';
import TimeIndicators from './components/TimeIndicators';
import { useSidebarStore } from './stores/useSidebarStore';
import SimulationSidebar from './components/SimulationSidebar';
import { Button } from '@/components/ui/button';
import { IconLayoutSidebarLeftCollapseFilled } from '@tabler/icons-react';
import DisplayOptionsSelector from './components/selector/DisplayOptionsSelector';
import { ModeToggle } from '@/components/layout/ToogleTheme';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { useTimeStore } from './stores/useTimeStore';
import { useEffect } from 'react';
import { useEntityStore } from './stores/useEntityStore';
import { decompressData } from './utils/encodeAndDecodeEntities';
import { useDisplayStore } from './stores/useDisplayStore';
import { decompressDisplay } from './utils/encodeAndDecodeDisplay';
import { useURL } from './hooks/useURL';
import { AnimatePresence, motion } from 'motion/react';

export default function CinematicaSimulation() {
    const { isOpen, toggleIsOpen } = useSidebarStore();

    const { getURLParams } = useURL();

    useEffect(() => {
        const setTime = useTimeStore.getState().updateTime;
        const setEntities = useEntityStore.getState().updateEntities;
        const setDisplay = useDisplayStore.getState().setDisplay;

        setEntities(decompressData(getURLParams('d') ?? ''));
        setTime(parseFloat(getURLParams('t') ?? '0'));
        setDisplay(decompressDisplay(getURLParams('o') ?? ''));
    }, []);

    return (
        <>
            <div
                className={`${
                    isOpen
                        ? 'w-0 hidden sm:w-[calc(100%-28rem)] sm:flex'
                        : 'w-full'
                } h-full relative`}
            >
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={toggleIsOpen}
                            className={`absolute top-4 right-4 z-50 text-stone-700 dark:text-stone-300  dark:hover:bg-stone-700 p-2 rounded transition-all duration-200 hover:scale-125 focus:outline-none focus:ring-2 focus:ring-stone-500 ${
                                isOpen ? 'hidden' : ''
                            }`}
                        >
                            <IconLayoutSidebarLeftCollapseFilled />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Abrir panel lateral</TooltipContent>
                </Tooltip>
                <Canvas className="bg-[#101713] w-full h-full" />
                <TimeIndicators
                    className={`absolute top-2 left-2 z-50 ${
                        isOpen ? 'hidden sm:flex' : ''
                    }`}
                />

                <div
                    className={`absolute top-1/2 translate-y-[-50%] right-4 z-50 ${
                        isOpen ? 'hidden' : 'flex flex-col gap-2'
                    }`}
                >
                    <FloatBar />
                    <div className="text-stone-900 dark:text-stone-100 dark:bg-stone-800/90 bg-stone-200 border dark:border-stone-700 border-stone-300 items-center justify-center p-3 gap-2 rounded-lg backdrop-blur-md shadow-lg sm:hidden flex flex-col">
                        <DisplayOptionsSelector />
                        <ModeToggle />
                    </div>
                </div>
                <AnimatePresence>
                    {!isOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 50 }}
                            transition={{ duration: 0.2 }}
                            className="absolute flex flex-col bottom-0 left-1/2 translate-x-[-50%] gap-2 mb-10 justify-center items-center"
                        >
                            <TimeControls />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Sidebar con ancho fijo */}
            <SimulationSidebar isOpen={isOpen} />
        </>
    );
}
