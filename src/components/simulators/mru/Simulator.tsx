import { Canvas } from "@/components/simulators/Canvas";
import { preload, setup, loop } from "@/components/simulators/mru/draw";

function MRUSimulator() {
    return (
        <section class="grid grid-cols-1 grid-rows-[auto_minmax(0,_1fr)] w-full min-h-full gap-8"> 
            <h1 class="text-4xl font-bold text-white">MRU Simulator</h1>
            <Canvas preload={preload} setup={setup} loop={loop}/>
        </section>
    )
}

export default MRUSimulator;