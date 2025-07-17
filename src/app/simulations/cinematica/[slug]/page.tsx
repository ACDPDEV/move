import { simulations } from "@/data/simulations";
import SimulationCard from "@/components/simulations/SimulationCard";

async function CinematicaMCU({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params;
    const simulation = simulations.find((sim) => sim.slug === ("cinematica/" + slug));

    return <SimulationCard simulation={simulation} showBackButton={true} />;
}

export default CinematicaMCU;