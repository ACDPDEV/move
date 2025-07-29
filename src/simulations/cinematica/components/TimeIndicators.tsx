import FPSBadge from './badges/FpsIndicator';
import BackButton from './buttons/BackButton';

function TimeIndicators({ className }: { className?: string }) {
    return (
        <div className={`${className} flex flex-col`}>
            <BackButton />
            <FPSBadge />
        </div>
    );
}

export default TimeIndicators;
