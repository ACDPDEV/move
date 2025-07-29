'use client';
import TimeControls from '@/simulations/cinematica/components/TimeControls';
import Canvas from '@/simulations/cinematica/components/Canvas';
import FloatBar from './components/FloatBar';
import TimeIndicators from './components/TimeIndicators';
import { useSidebarStore } from './stores/useSidebarStore';
import SimulationSidebar from './components/SimulationSidebar';
import { Button } from '@/components/ui/button';
import { IconLayoutSidebarLeftCollapseFilled } from '@tabler/icons-react';

export default function CinematicaSimulation() {
    const { isOpen, toggleIsOpen } = useSidebarStore();

    return (
        <main className="w-screen h-screen bg-stone-900 flex flex-row">
            <div
                className={`${
                    isOpen ? 'w-[calc(100%-28rem)]' : 'w-full'
                } h-full relative`}
            >
                <Button
                    variant="outline"
                    size="icon"
                    onClick={toggleIsOpen}
                    className={`absolute top-4 right-4 z-50 ${
                        isOpen ? 'hidden' : ''
                    }`}
                >
                    <IconLayoutSidebarLeftCollapseFilled />
                </Button>
                <Canvas className="bg-white dark:bg-black w-full h-full" />
                <TimeIndicators />

                <div
                    className={`absolute flex flex-col bottom-0 left-1/2 translate-x-[-50%] gap-2 mb-10 justify-center items-center transition-all duration-300 ${
                        isOpen ? 'translate-x-full hidden' : 'translate-x-0'
                    }`}
                >
                    <FloatBar />
                    <TimeControls />
                </div>
            </div>

            {/* Sidebar con ancho fijo */}
            <SimulationSidebar isOpen={isOpen} />
        </main>
    );
}
