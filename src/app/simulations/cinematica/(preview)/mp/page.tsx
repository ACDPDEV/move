import { simulations } from "@/data/simulations";
import SimulationCard from "@/components/simulations/SimulationCard";

function CinematicaMP() {
  const simulation = simulations.find((sim) => sim.slug === "cinematica/mp");

  return <SimulationCard simulation={simulation} showBackButton={true} />;
}

export default CinematicaMP;