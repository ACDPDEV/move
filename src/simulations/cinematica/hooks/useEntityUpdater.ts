import { useEffect, useRef } from 'react';
import { useTimeStore } from '../store/useTimeStore';
import { useEntityStore } from '../store/useEntityStore';

// 🧠 Suscripciones reactivas
function useEntityUpdater() {
    const isPlaying = useTimeStore((state) => state.isPlaying);
    const timeBeforeReset = useTimeStore((state) => state.timeBeforeReset);
    const inputTimeChange = useTimeStore((state) => state.inputTimeChange);

    const frame = useRef<number | null>(null);

    useEffect(() => {
        const loop = () => {
            const {
                delta,
                isPlaying,
                timeBeforeReset,
                movementPrediction,
                inputTimeChange,
                speed,
            } = useTimeStore.getState();

            const entities = useEntityStore.getState().entities;

            if (isPlaying) {
                entities.forEach((entity) => {
                    entity.update(delta);
                });
            }

            if (timeBeforeReset !== 0) {
                console.log('reset');
                console.log(timeBeforeReset);
                entities.forEach((entity) => {
                    entity.update((0 - timeBeforeReset) * 2);
                    entity.resetTrajectory();
                });
                useTimeStore.setState({ timeBeforeReset: 0 });
            }

            if (movementPrediction && inputTimeChange > 0) {
                entities.forEach((entity) => {
                    entity.update(inputTimeChange);
                });
                useTimeStore.setState({ inputTimeChange: 0 });
            }

            frame.current = requestAnimationFrame(loop);
        };

        frame.current = requestAnimationFrame(loop);
        return () => {
            if (frame.current) cancelAnimationFrame(frame.current);
        };
    }, [isPlaying, timeBeforeReset, inputTimeChange]);
}

export { useEntityUpdater };
