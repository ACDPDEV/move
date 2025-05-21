import response from "@/mock/response.json";
import type Simulators from "@/pages/simulators.astro";
import { type Simulator } from "@/types/Simulator";

function useSimulators() {
    const simulators: Simulator[] = response.map((simulator: Simulator) => ({
        name: simulator.name,
        description: simulator.description,
        href: simulator.href,
        area: simulator.area,
        image: simulator.image,
    }));
    return simulators;
}

export { useSimulators };