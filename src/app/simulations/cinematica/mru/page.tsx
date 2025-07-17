import { simulations } from "@/data/simulations";
import SimulationCard from "@/components/simulations/SimulationCard";

function CinematicaMRU() {
  const simulation = simulations.find((sim) => sim.slug === "cinematica/mru");

  return <SimulationCard simulation={simulation} showBackButton={true} />;
}

export default CinematicaMRU;