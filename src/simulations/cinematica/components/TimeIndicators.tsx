import FPSBadge from '@/simulations/cinematica/components/badges/FpsIndicator';
import BackButton from '@/simulations/cinematica/components/buttons/BackButton';
import { useOptionsStore } from '@/simulations/cinematica/stores/useOptionsStore';

function TimeIndicators({ className }: { className?: string }) {
    const { fps } = useOptionsStore((s) => s.display);
    return (
        <div className={`${className} flex flex-col`}>
            <BackButton />
            {fps && <FPSBadge />}
        </div>
    );
}

export default TimeIndicators;
