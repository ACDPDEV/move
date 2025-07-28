import { Button } from '@/components/ui/button';
import { useTimeStore } from '../../store/useTimeStore';
import { IconReload } from '@tabler/icons-react';
import { useEntityStore } from '../../store/useEntityStore';

function ResetButton() {
    const reset = useTimeStore((s) => s.reset);

    return (
        <Button
            onClick={() => {
                reset();
                useEntityStore
                    .getState()
                    .entities.forEach((entity) => entity.resetTrajectory());
            }}
            title="Reiniciar simulación"
            className="text-stone-700 dark:text-stone-300  dark:hover:bg-stone-700 p-2 rounded transition-all duration-200 hover:scale-125 focus:outline-none focus:ring-2 focus:ring-stone-500"
            type="button"
            variant="outline"
        >
            <IconReload size={20} />
        </Button>
    );
}

export default ResetButton;
