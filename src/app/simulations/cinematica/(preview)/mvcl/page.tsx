import { simulations } from "@/data/simulations";
import SimulationCard from "@/components/simulations/SimulationCard";

function CinematicaMVCL() {
  const simulation = simulations.find((sim) => sim.slug === "cinematica/mvcl");

  return <SimulationCard simulation={simulation} showBackButton={true} />;
}

export default CinematicaMVCL;