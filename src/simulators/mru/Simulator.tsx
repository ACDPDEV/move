import { Canvas } from "@/components/simulators-renderer/Canvas";
import { Application } from "pixi.js";
import { preload, setup, loop } from "@/simulators/mru/draw";
import { useState, useRef, useEffect } from "preact/hooks";
import {
    IconCircleCaretLeftFilled,
    IconLayoutSidebarLeftCollapseFilled,
    IconLayoutSidebarRightCollapseFilled,
    IconClockRecord,
    IconReload,
    IconPlayerPlay,
    IconPlayerPause,
} from "@tabler/icons-preact";

function MRUSimulator({ slug }: { slug: string }) {
    const appRef = useRef<Application | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isAppReady, setIsAppReady] = useState(false);
    const [simulationTime, setSimulationTime] = useState(0);
    const simulationTimeRef = useRef(0);

    useEffect(() => {
        if (!appRef.current) return;
        
        const ticker = appRef.current.ticker;
        

        const timeAccumulator = () => {
            simulationTimeRef.current += ticker.deltaMS;
            
            if (Math.floor(simulationTimeRef.current / 100) !== Math.floor((simulationTimeRef.current - ticker.deltaMS) / 100)) {
                setSimulationTime(simulationTimeRef.current);
            }
        };
        
        ticker.add(timeAccumulator);
        
        return () => {
            ticker.remove(timeAccumulator);
        };
    }, [isAppReady, appRef.current?.ticker]);

    const handleClickResetButton = () => {
        console.log("Reset button clicked");
        simulationTimeRef.current = 0;
        setSimulationTime(0);
    };

    useEffect(() => {
        appRef.current = new Application();
        setIsAppReady(true);
        
        return () => {
            if (appRef.current) {
                appRef.current.destroy();
            }
        };
    }, []);

    const handleClickSidebarButton = () => {
        console.log("Sidebar button clicked");
        setIsSidebarOpen(!isSidebarOpen);
    };

    const handleClickPlayButton = () => {
        console.log("Play button clicked");
        if (!appRef.current?.ticker) {
            console.error('App or ticker not available');
            return;
        }
        
        setIsPlaying(!isPlaying);
        setSimulationTime(simulationTimeRef.current);
        try {
            isPlaying ? appRef.current.ticker.stop() : appRef.current.ticker.start();
        } catch (error) {
            console.error('Error starting/stopping ticker:', error);
        }
    };

    const handleClickTimeStepButton = () => {
        console.log("Time step button clicked");
    };

    if (!isAppReady || !appRef.current) {
        return (
            <div class="flex items-center justify-center w-full h-full bg-stone-900 text-stone-200">
                <div class="text-lg">Loading simulator...</div>
            </div>
        );
    }

    return (
        <>
            <header class="flex flex-row h-10 w-full justify-between items-center bg-stone-900 text-stone-200 p-3 border-b border-stone-700">
                <a href={`/simulators/preview/${slug}/`} class="flex flex-row gap-2 items-center">
                    <IconCircleCaretLeftFilled class=" hover:scale-110 transition-all" />
                </a>
                <h1 class="text-2xl font-bold">MRU</h1>
                <button class="hover:scale-110 transition-all" onClick={handleClickSidebarButton}>
                    {isSidebarOpen 
                        ? (
                            <IconLayoutSidebarRightCollapseFilled class="" />
                        )
                        : (
                            <IconLayoutSidebarLeftCollapseFilled class="" />
                        )
                    }
                </button>
            </header>
            <div class="grid grid-cols-[minmax(0,1fr)_auto] grid-rows-1 w-full h-[calc(100%-2.5rem)]">
                <main class="flex flex-col w-full h-full p-3 gap-3">
                    <div class="relative w-full h-full rounded-md overflow-hidden items-center justify-center">
                        <Canvas app={appRef.current} setup={setup} preload={preload} loop={loop} />
                        <div class="absolute flex flex-row bottom-0 left-1/2 translate-x-[-50%] w-fit h-fit bg-stone-800 border border-stone-700 items-center justify-center p-3 gap-3 rounded-sm mb-10 backdrop-opacity-0 backdrop-blur-md">
                            <button class="hover:scale-110 transition-all" onClick={handleClickTimeStepButton}>
                                <IconClockRecord class="" />
                            </button>
                            <button class="hover:scale-110 transition-all" onClick={handleClickPlayButton}>
                                {isPlaying
                                    ? (
                                        <IconPlayerPause class="" />
                                    )
                                    : (
                                        <IconPlayerPlay class="" />
                                    )
                                }
                            </button>
                            <button class="hover:scale-110 transition-all" onClick={handleClickResetButton}>
                                <IconReload class="" />
                            </button>
                            <span>{simulationTime.toFixed(0)} ms</span>
                        </div>
                    </div>
                </main>
                <nav
                    class={`w-80 h-full bg-stone-900 border-l border-stone-700 transform transition-all duration-300 ease-in-out ${ isSidebarOpen ? 'translate-x-0' : 'translate-x-full' }`}
                    style={{ width: isSidebarOpen ? '380px' : '0px' }}
                >
                    <ul class="flex flex-col gap-3 p-3">
                        <li class="flex flex-row gap-3">
                            <label>Posición</label>
                            <input class="bg-stone-800" />
                        </li>
                        <li class="flex flex-row gap-3">
                            <label>Velocidad</label>
                            <input class="bg-stone-800" />
                        </li>
                        <li class="flex flex-row gap-3">
                            <label>Aceleración</label>
                            <input class="bg-stone-800" />
                        </li>
                    </ul>
                </nav>
            </div>
        </>
    )
}

export default MRUSimulator;