import { useEntityStore } from '../../stores/useEntityStore';
import {
    IconCurrentLocation,
    IconCurrentLocationFilled,
} from '@tabler/icons-react';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import Button from '../ui/button';
import styles from '../../consts/styles';

function FlowEntityButton({ entityId }: { entityId: string }) {
    const selectedEntityId = useEntityStore((s) => s.selectedEntityId);
    const setSelectedAsThisEntityId = () =>
        useEntityStore.getState().setSelectedEntityId(entityId);
    const deselectThisEntity = () =>
        useEntityStore.getState().setSelectedEntityId(null);

    return (
        <Button
            onClick={
                selectedEntityId === entityId
                    ? deselectThisEntity
                    : setSelectedAsThisEntityId
            }
            tooltip={
                selectedEntityId === entityId
                    ? 'Deseleccionar Móvil'
                    : 'Seleccionar Móvil'
            }
        >
            {selectedEntityId === entityId ? (
                <IconCurrentLocationFilled className={styles.icon} />
            ) : (
                <IconCurrentLocation className={styles.icon} />
            )}
        </Button>
    );
}

export default FlowEntityButton;
