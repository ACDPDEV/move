import { Canvas } from "@/components/simulators/Canvas";
import { preload, setup, loop } from "@/components/simulators/mru/draw";
import { useState } from "preact/hooks";
import { Controls } from "@/components/simulators/mru/Controls";
import {
    IconCircleCaretLeftFilled,
    IconLayoutSidebarLeftCollapseFilled,
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
                    <IconLayoutSidebarLeftCollapseFilled class="" />
                </button>
            </header>
            <div class="grid grid-cols-[minmax(0,1fr)_auto] grid-rows-1 w-full h-[calc(100%-2.5rem)]">
                <main class="flex flex-col w-full h-full p-3 gap-3">
                    <div class="relative w-full h-full rounded-md overflow-hidden items-center justify-center">
                        <Canvas setup={setup} preload={preload} loop={loop} />
                        <div class="absolute bottom-0 w-fit h-10 bg-stone-500 items-center justify-center p-3 gap-3 rounded-sm mb-10">
                            Controls
                        </div>
                    </div>
                </main>
                <nav class={`${isSidebarOpen ? "block" : "hidden"} w-md h-full bg-stone-900 border-l border-stone-700`}>

                </nav>
            </div>
        </>
    )
}

export default MRUSimulator;