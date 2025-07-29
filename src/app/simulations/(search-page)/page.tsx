import SimulationsForm from '@/components/simulations/SimulationsForm';

function Simulations() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
            <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
                <SimulationsForm />
            </div>
        </div>
    );
}

export default Simulations;
