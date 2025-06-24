import { useEffect, useRef, useState } from "preact/hooks";
import {
    IconCircleCaretLeftFilled,
    IconClockRecord,
    IconLayoutSidebarLeftCollapseFilled,
    IconLayoutSidebarRightCollapseFilled,
    IconPlayerPause,
    IconPlayerPlay,
    IconReload,
} from "@tabler/icons-preact";
import { Application } from "pixi.js";
import { setup, preload, loop } from "@/simulators/mru/draw";

interface ApplicationStorage {
    entities: any[]
}

function MRUSimulator({ slug }: { slug: string }) {
    

    const appRef = useRef<Application | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const timeRef = useRef<number>(0);
    const appStorageRef = useRef<ApplicationStorage>({
        entities: []
    });
    
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [simulatorProperties, setSimulatorProperties] = useState({
        time: 0,
        fps: 0,
    })
    
    const timeCountUpdate = () => {
        timeRef.current += appRef.current?.ticker?.deltaMS || 0;

        if (Math.floor(timeRef.current / 100) !== Math.floor((timeRef.current - (appRef.current?.ticker?.deltaMS || 0)) / 100)) {
            setSimulatorProperties({
                time: timeRef.current,
                fps: appRef.current?.ticker?.FPS || 0,
            })
        }
    }
    
    useEffect(() => {
        (async () => {
            appRef.current = new Application();	
            try {
                await setup(appRef.current, canvasRef.current as HTMLCanvasElement, containerRef.current as HTMLDivElement);
                await preload();
                loop(appRef.current, appStorageRef.current);
                appRef.current.ticker.add(timeCountUpdate);
            } catch (error) {
                console.error('Error creating PixiJS application:', error);
            }
        })();
    }, []);


    const handleClickSidebarButton = () => {
        setIsSidebarOpen(!isSidebarOpen);
    
    }
    const handleClickTimeStepButton = () => {
        
    }
    const handleClickPlayButton = () => {
        setIsPlaying(!isPlaying);
        isPlaying ? appRef.current?.ticker.stop() : appRef.current?.ticker.start();
        setSimulatorProperties({
            time: timeRef.current,
            fps: appRef.current?.ticker?.FPS || 0,
        })
    }
    const handleClickResetButton = () => {
        
    }
    

    return (
        <>
            <header class="flex flex-row h-10 w-full justify-between items-center bg-stone-900 text-stone-200 p-3 border-b border-stone-700">
                <a href={`/simulators/preview/${slug}/`} class="flex flex-row gap-2 items-center">
                    <IconCircleCaretLeftFilled class=" hover:scale-110 transition-all" />
                </a>
                <h1 class="text-2xl font-bold">MRU / MRUV</h1>
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
                        <div ref={containerRef} class="relative w-full h-full">
                            <canvas ref={canvasRef}/>
                        </div>
                        <div class="absolute flex flex-row top-0 left-0 w-fit h-fit bg-stone-800 border border-stone-700 items-center justify-center p-3 gap-3 rounded-sm mt-4 ml-4 backdrop-opacity-0 backdrop-blur-md shadow-lg">
                            <span>{simulatorProperties.fps.toFixed(0)} FPS</span>
                            <span>{simulatorProperties.time.toFixed(0)} ms</span>
                        </div>
                        <div style={{
                            display: isSidebarOpen ? 'none' : 'flex' 
                        }} class="absolute flex flex-col top-0 right-0 w-fit h-fit bg-stone-800 border border-stone-700 items-center justify-center p-3 gap-3 rounded-sm mt-4 mr-4 backdrop-opacity-0 backdrop-blur-md shadow-lg">
                            <div class="flex flex-col gap-3" onClick={handleClickSidebarButton}>
                                {appStorageRef.current.entities.length > 0 ? (
                                    appStorageRef.current.entities.map((entity, index) => {
                                        return (
                                            <ul class="flex flex-col gap-3 p-3">
                                                <li class="flex flex-row gap-3">
                                                    <label>Posición</label>
                                                    <input class="bg-stone-800" value={appStorageRef.current.entities[0].position.x.toFixed(1)} />
                                                </li>
                                                <li class="flex flex-row gap-3">
                                                    <label>Velocidad</label>
                                                    <input class="bg-stone-800" value={appStorageRef.current.entities[0].velocity.x.toFixed(1)} />
                                                </li>
                                                <li class="flex flex-row gap-3">
                                                    <label>Aceleración</label>
                                                    <input class="bg-stone-800" value={appStorageRef.current.entities[0].acceleration.x.toFixed(1)} />
                                                </li>
                                            </ul>
                                        )
                                    })
                                ) : (
                                    <span>No hay entidades</span>
                                )}
                            </div>
                        </div>
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
                        </div>
                    </div>
                </main>
                <nav
                    class={`w-80 h-full bg-stone-900 border-l border-stone-700 transform transition-all duration-300 ease-in-out ${ isSidebarOpen ? 'translate-x-0' : 'translate-x-full' }`}
                    style={{ width: isSidebarOpen ? '380px' : '0px' }}
                >
                    {appStorageRef.current.entities[0] ? (        
                        <ul class="flex flex-col gap-3 p-3">
                            <li class="flex flex-row gap-3">
                                <label>Posición</label>
                                <input class="bg-stone-800" value={appStorageRef.current.entities[0].position.x.toString()} />
                            </li>
                            <li class="flex flex-row gap-3">
                                <label>Velocidad</label>
                                <input class="bg-stone-800" value={appStorageRef.current.entities[0].velocity.x.toString()} />
                            </li>
                            <li class="flex flex-row gap-3">
                                <label>Aceleración</label>
                                <input class="bg-stone-800" value={appStorageRef.current.entities[0].acceleration.x.toString()} />
                            </li>
                        </ul>
                    ) : (
                        <span>No hay entidades</span>
                    )}
                </nav>
            </div>
        </>
    )
}

export default MRUSimulator;