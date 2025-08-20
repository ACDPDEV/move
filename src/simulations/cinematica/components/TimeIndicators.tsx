import FPSBadge from './badges/FpsIndicator';
import BackButton from './buttons/BackButton';
import { useDisplayStore } from '../stores/useDisplayStore';

function TimeIndicators({ className }: { className?: string }) {
    const { fps } = useDisplayStore.getState();
    return (
        <div className={`${className} flex flex-col`}>
            <BackButton />
            {fps && <FPSBadge />}
        </div>
    );
}

export default TimeIndicators;
