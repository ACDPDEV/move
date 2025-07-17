import { simulations } from "@/data/simulations";
import SimulationCard from "@/components/simulations/SimulationCard";

function CinematicaMCU() {
  const simulation = simulations.find((sim) => sim.slug === "cinematica/mcu");

  return <SimulationCard simulation={simulation} showBackButton={true} />;
}

export default CinematicaMCU;