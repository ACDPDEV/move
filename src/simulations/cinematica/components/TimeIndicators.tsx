import FPSBadge from './badges/FpsIndicator';
import BackButton from './buttons/BackButton';
import { useOptionsStore } from '../stores/useOptionsStore';

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
