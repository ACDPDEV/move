import { simulations } from "@/data/simulations";
import SimulationCard from "@/components/simulations/SimulationCard";

function CinematicaMRUV() {
  const simulation = simulations.find((sim) => sim.slug === "cinematica/mruv");

  return <SimulationCard simulation={simulation} showBackButton={true} />;
}

export default CinematicaMRUV;