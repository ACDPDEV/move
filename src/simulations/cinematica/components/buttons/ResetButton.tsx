'use client';
import { useTimeStore } from '@/simulations/cinematica/stores/useTimeStore';
import { IconReload } from '@tabler/icons-react';
import { useEntityStore } from '@/simulations/cinematica/stores/useEntityStore';
import { useURL } from '@/simulations/cinematica/hooks/useURL';
import { compressData } from '@/simulations/cinematica/utils/encodeAndDecodeEntities';
import Button from '@/components/ui/better-button';
import styles from '@/simulations/cinematica/consts/styles';

function useResetButton() {
    const reset = useTimeStore((s) => s.reset);
    const resetAllEntities = useEntityStore((s) => s.resetAllEntities);
    const { setURLParams } = useURL();
    const onClick = () => {
        resetAllEntities();
        reset();
        setURLParams({
            t: useTimeStore.getState().time.toFixed(2),
            d: compressData(useEntityStore.getState().entities),
        });
    };
    return { onClick };
}

function ResetButton() {
    const { onClick } = useResetButton();

    return (
        <Button onClick={onClick} tooltip="Reiniciar">
            <IconReload className={styles.icon} />
        </Button>
    );
}

export default ResetButton;
