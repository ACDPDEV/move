import { Button } from '@/components/ui/button';
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

function FlowEntityButton({ entityId }: { entityId: string }) {
    const selectedEntityId = useEntityStore((s) => s.selectedEntityId);
    const setSelectedAsThisEntityId = () =>
        useEntityStore.getState().setSelectedEntityId(entityId);
    const deselectThisEntity = () =>
        useEntityStore.getState().setSelectedEntityId(null);

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Button
                    variant="outline"
                    size="icon"
                    onClick={
                        selectedEntityId === entityId
                            ? deselectThisEntity
                            : setSelectedAsThisEntityId
                    }
                    className={`${
                        selectedEntityId === entityId
                            ? 'bg-stone-300 dark:bg-stone-700'
                            : ''
                    }`}
                >
                    {selectedEntityId === entityId ? (
                        <IconCurrentLocationFilled />
                    ) : (
                        <IconCurrentLocation />
                    )}
                </Button>
            </TooltipTrigger>
            <TooltipContent>Seguir Móvil</TooltipContent>
        </Tooltip>
    );
}

export default FlowEntityButton;
