import Sidebar from '@/simulations/cinematica/components/Sidebar';
import TimeControls from '@/simulations/cinematica/components/TimeControls';
import Canvas from '@/simulations/cinematica/components/Canvas';
import FloatBar from './components/FloatBar';
import TimeIndicators from './components/TimeIndicators';

export default function CinematicaSimulation() {
    console.log('render simulation');
    return (
        <div className="relative w-full h-full bg-stone-900">
            <Canvas style={{ width: '100%', height: '100%' }} />

            <Sidebar />

            <TimeIndicators />

            <div className="absolute flex flex-col bottom-0 left-1/2 translate-x-[-50%] gap-2 mb-10 justify-center items-center">
                <FloatBar />
                <TimeControls />
            </div>
        </div>
    );
}
