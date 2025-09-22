import { simulations } from "@/data/simulations";
import SimulationCard from "@/components/simulations/SimulationCard";

function CinematicaBlank() {
  const simulation = simulations.find((sim) => sim.slug === "cinematica/blank");

  return <SimulationCard simulation={simulation} showBackButton={true} />;
}

export default CinematicaBlank;