import Sidebar from '@/simulations/cinematica/components/Sidebar';
import TimeControls from '@/simulations/cinematica/components/TimeControls';
import Canvas from '@/simulations/cinematica/components/Canvas';
import FloatBar from './components/FloatBar';
import TimeIndicators from './components/TimeIndicators';

export default function CinematicaSimulation() {
    return (
        <>
            <div className="relative w-full h-full bg-stone-900 hidden md:flex">
                <Canvas style={{ width: '100%', height: '100%' }} />

                <Sidebar />

                <TimeIndicators />

                <div className="absolute flex flex-col bottom-0 left-1/2 translate-x-[-50%] gap-2 mb-10 justify-center items-center">
                    <FloatBar />
                    <TimeControls />
                </div>
            </div>
            <div className="relative w-screen h-screen bg-stone-900 flex md:hidden justify-center items-center p-4">
                <div className="flex flex-col gap-4 text-center">
                    <span className="prose dark:prose-invert">
                        Esta simulación solo está disponible en tu tipo de
                        pantalla, <strong>estamos trabajando en ello</strong>
                    </span>
                    <span className="prose dark:prose-invert">
                        Sí estás en PC, cambia a pantalla completa y recarga la
                        página
                    </span>
                </div>
            </div>
        </>
    );
}
