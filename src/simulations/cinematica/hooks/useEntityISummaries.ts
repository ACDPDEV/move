import { useEffect, useRef, useState } from 'react';
import { useEntityStore } from '@/simulations/cinematica/stores/useEntityStore';

/**
 * Devuelve un array de objetos { id, color }
 * y sólo se actualiza cuando cambia la longitud,
 * algún id o el color de alguna entidad.
 */
export function useEntitySummaries(): { id: string; color: string }[] {
    // Estado local con la lista inicial de {id, color}
    const [list, setList] = useState(() =>
        useEntityStore
            .getState()
            .entities.map((e) => ({ id: e.id, color: e.color })),
    );

    // Ref para guardar la lista previa y compararla
    const prevRef = useRef<{ id: string; color: string }[]>(list);

    useEffect(() => {
        const unsubscribe = useEntityStore.subscribe((state) => {
            // Construimos la nueva lista de summaries
            const newList = state.entities.map((e) => ({
                id: e.id,
                color: e.color,
            }));

            const prevList = prevRef.current;

            // Comparamos longitud
            const sameLength = newList.length === prevList.length;

            // Comparamos id Y color en cada posición
            const sameContent =
                sameLength &&
                newList.every(
                    (item, i) =>
                        item.id === prevList[i].id &&
                        item.color === prevList[i].color,
                );

            if (!sameContent) {
                prevRef.current = newList;
                setList(newList);
            }
        });

        return unsubscribe;
    }, []);

    return list;
}
