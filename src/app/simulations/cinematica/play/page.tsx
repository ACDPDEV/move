import CinematicaSimulationContainer from "@/simulations/cinematica/Simulation";

function CinematicaSimulationPlay() {
  return (
    <CinematicaSimulationContainer />
  );
}

CinematicaSimulationPlay.getLayout = function getLayout(page: React.ReactNode) {
  return page; // Sin layout, solo la página
};

export default CinematicaSimulationPlay;