'use client';
import { IconPlayerPause, IconPlayerPlay } from '@tabler/icons-react';
import { useTimeStore } from '@/simulations/cinematica/stores/useTimeStore';
import { useURL } from '@/simulations/cinematica/hooks/useURL';
import { compressData } from '@/simulations/cinematica/utils/encodeAndDecodeEntities';
import { useEntityStore } from '@/simulations/cinematica/stores/useEntityStore';
import Button from '@/components/ui/better-button';
import styles from '@/simulations/cinematica/consts/styles';

function usePlayerToggle() {
    const { setURLParams } = useURL();

    const isPlaying = useTimeStore((s) => s.isPlaying);
    const togglePlayer = useTimeStore((s) => s.togglePlayer);

    const onClick = () => {
        togglePlayer();
        setURLParams({
            t: useTimeStore.getState().time.toFixed(2),
            d: compressData(useEntityStore.getState().entities),
        });
    };

    return { isPlaying, onClick };
}

function PlayerToggle() {
    const { isPlaying, onClick } = usePlayerToggle();
    return (
        <Button onClick={onClick} tooltip={isPlaying ? 'Pausar' : 'Iniciar'}>
            {isPlaying ? (
                <IconPlayerPause className={styles.icon} />
            ) : (
                <IconPlayerPlay className={styles.icon} />
            )}
        </Button>
    );
}

export default PlayerToggle;
