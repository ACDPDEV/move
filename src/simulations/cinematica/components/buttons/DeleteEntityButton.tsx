import { Button } from '@/components/ui/button';
import { IconTrash } from '@tabler/icons-react';
import { useEntityStore } from '../../stores/useEntityStore';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';

function DeleteEntityButton({ entityId }: { entityId: string }) {
    const deleteThisEntity = () =>
        useEntityStore.getState().deleteEntity(entityId);
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Button
                    variant="outline"
                    size="icon"
                    className="bg-transparent border border-red-600 text-red-600 hover:bg-red-600 hover:text-white dark:bg-transparent dark:hover:bg-red-600"
                    onClick={deleteThisEntity}
                >
                    <IconTrash />
                </Button>
            </TooltipTrigger>
            <TooltipContent>Eliminar Móvil</TooltipContent>
        </Tooltip>
    );
}

export default DeleteEntityButton;
