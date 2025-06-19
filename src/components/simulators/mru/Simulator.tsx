import { Canvas } from "@/components/simulators/Canvas";
import { preload, setup, loop } from "@/components/simulators/mru/draw";
import { useState } from "preact/hooks";
import {
    IconCircleCaretLeftFilled,
    IconDeviceMobileCharging,
    IconLayoutSidebarLeftCollapseFilled,
    IconLayoutSidebarRightCollapseFilled,
    IconReload,
    IconStopwatch,
} from "@tabler/icons-preact";

function MRUSimulator(
    { slug }: { slug: string }
) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleClickSidebarButton = () => {
        console.log("Sidebar button clicked");
        setIsSidebarOpen(!isSidebarOpen);
    };

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
                        <Canvas setup={setup} preload={preload} loop={loop} />
                        <div class="absolute bottom-0 left-1/2 translate-x-[-50%] w-fit h-10 bg-stone-500 items-center justify-center p-3 gap-3 rounded-sm mb-10">
                            <button class="hover:scale-110 transition-all">
                                <IconDeviceMobileCharging class="" />
                            </button>
                            <button class="hover:scale-110 transition-all">
                                <IconStopwatch class="" />
                            </button>
                            <button class="hover:scale-110 transition-all">
                                <IconReload class="" />
                            </button>
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