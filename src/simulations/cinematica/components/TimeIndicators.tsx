import FPSBadge from './badges/FpsIndicator';
import BackButton from './buttons/BackButton';

function TimeIndicators() {
    return (
        <div className="absolute top-2 left-2 flex flex-col">
            <BackButton />
            <FPSBadge />
        </div>
    );
}

export default TimeIndicators;
