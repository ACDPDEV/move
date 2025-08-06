import { Button } from '@/components/ui/button';
import { useTimeStore } from '../../stores/useTimeStore';
import { IconReload } from '@tabler/icons-react';
import { useEntityStore } from '../../stores/useEntityStore';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

function ResetButton() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const reset = useTimeStore((s) => s.reset);

    const onClick = () => {
        reset();
        useEntityStore.getState().entities.forEach((entity) => {
            entity.resetProperties();
            entity.resetTrajectory();
        });
        const params = new URLSearchParams(searchParams);
        params.set('t', '0');
        replace(`${pathname}?${params.toString()}`);
    };

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Button
                    onClick={onClick}
                    className="text-stone-700 dark:text-stone-300  dark:hover:bg-stone-700 p-2 rounded transition-all duration-200 hover:scale-125 focus:outline-none focus:ring-2 focus:ring-stone-500"
                    type="button"
                    variant="outline"
                >
                    <IconReload size={20} />
                </Button>
            </TooltipTrigger>
            <TooltipContent>Reiniciar</TooltipContent>
        </Tooltip>
    );
}

export default ResetButton;
