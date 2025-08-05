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
import { useSearchParams } from 'next/navigation';
import { useTimeStore } from './stores/useTimeStore';
import { useEffect } from 'react';
import { useEntityStore } from './stores/useEntityStore';
import { decodeCompact, decompressData } from './utils/encodeAndDecodeEntities';
import { useDisplayStore } from './stores/useDisplayStore';
import { decompressDisplay } from './utils/encodeAndDecodeDisplay';

export default function CinematicaSimulation() {
    const { isOpen, toggleIsOpen } = useSidebarStore();

    const searchParams = useSearchParams();

    useEffect(() => {
        const setTime = useTimeStore.getState().updateTime;
        const setEntities = useEntityStore.getState().updateEntities;
        const setDisplay = useDisplayStore.getState().setDisplay;

        const data = decompressData(decodeCompact(searchParams.get('d') ?? ''));

        setEntities(data);
        setTime(parseFloat(searchParams.get('t') ?? '0'));
        setDisplay(decompressDisplay(searchParams.get('o') ?? ''));
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
                <Canvas className="bg-white dark:bg-black w-full h-full" />
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
                <div
                    className={`absolute flex flex-col bottom-0 left-1/2 translate-x-[-50%] gap-2 mb-10 justify-center items-center transition-all duration-300 ${
                        isOpen ? 'translate-x-full hidden' : 'translate-x-0'
                    }`}
                >
                    <TimeControls />
                </div>
            </div>

            {/* Sidebar con ancho fijo */}
            <SimulationSidebar isOpen={isOpen} />
        </>
    );
}
