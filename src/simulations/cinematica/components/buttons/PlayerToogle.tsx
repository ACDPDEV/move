'use client';
import { IconPlayerPause, IconPlayerPlay } from '@tabler/icons-react';
import { useTimeStore } from '@/simulations/cinematica/stores/useTimeStore';
import { useURL } from '@/simulations/cinematica/hooks/useURL';
import { compressData } from '../../utils/encodeAndDecodeEntities';
import { useEntityStore } from '../../stores/useEntityStore';
import Button from '../ui/button';
import styles from '../../consts/styles';

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
