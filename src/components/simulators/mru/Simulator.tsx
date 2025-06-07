import { Canvas } from "@/components/simulators/Canvas";
import { draw } from "@/components/simulators/mru/draw";

function MRUSimulator() {
    return (
        <section class="flex flex-col w-full h-full gap-16 justify-center items-center">
            <h1 class="text-4xl font-bold">MRU Simulator</h1>
            <div class="h-full w-full">
                <Canvas draw={draw} contextId="2d" resize={true} />
            </div>
        </section>
    )
}

export default MRUSimulator;