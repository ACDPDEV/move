// app/simulations/cinematica/play/page.jsx
import { Suspense } from 'react';
import CinematicaSimulation from '@/simulations/cinematica/Simulation';

function LoadingFallback() {
  return (
    <div className="w-full h-screen flex items-center justify-center bg-black">
      <div className="text-white">
        Cargando simulación...
      </div>
    </div>
  );
}

export default function PlayPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <CinematicaSimulation />
    </Suspense>
  );
}