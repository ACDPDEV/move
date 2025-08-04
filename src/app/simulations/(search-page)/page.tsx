import SimulationsForm from '@/components/simulations/SimulationsForm';
import Aureola from '@/components/svgs/Aureola';
import Line from '@/components/svgs/Line';

function Simulations() {
    return (
        <div className="min-h-screen relative">
            <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 z-4">
                <SimulationsForm />
            </div>
        </div>
    );
}

export default Simulations;
