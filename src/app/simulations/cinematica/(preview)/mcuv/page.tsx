import { simulations } from "@/data/simulations";
import SimulationCard from "@/components/simulations/SimulationCard";

function CinematicaMCUV() {
  const simulation = simulations.find((sim) => sim.slug === "cinematica/mcuv");

  return <SimulationCard simulation={simulation} showBackButton={true} />;
}

export default CinematicaMCUV;