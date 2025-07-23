import { create } from 'zustand';
import {
    Entity,
    type EntityProps,
} from '@/simulations/cinematica/entities/Entity';

type EntityStore = {
    entities: Entity[];
    updateEntities: (entities: Entity[]) => void;
    updateAllEntities: (deltaTime: number) => void;
    updateEntity: (id: string, updates: Partial<EntityProps>) => void;
    updateSpecificPropOfEntity: (
        id: string,
        prop:
            | 'position.x'
            | 'position.y'
            | 'velocity.x'
            | 'velocity.y'
            | 'acceleration.x'
            | 'acceleration.y'
            | 'radius'
            | 'color',
        value: number | string,
    ) => void;
    deleteEntity: (id: string) => void;
    addEntity: (props?: Partial<EntityProps>) => void;
};

const useEntityStore = create<EntityStore>((set, get) => ({
    entities: [
        new Entity({
            position: { x: 100, y: 300 },
            velocity: { x: 100, y: 0 },
            acceleration: { x: 0, y: 0 },
            radius: 10,
            color: '#FF0000',
        }),
        new Entity({
            position: { x: 200, y: 300 },
            velocity: { x: 0, y: 100 },
            acceleration: { x: 0, y: 0 },
            radius: 10,
            color: '#E3CF00',
        }),
        new Entity({
            position: { x: 300, y: 300 },
            velocity: { x: 100, y: 100 },
            acceleration: { x: 0, y: 0 },
            radius: 10,
            color: '#3F00FF',
        }),
    ],

    updateEntities: (entities) => set({ entities }),

    // ✅ Para simulaciones de alta frecuencia
    updateAllEntities: (deltaTime: number) => {
        const state = get();

        // Mutación eficiente
        for (const entity of state.entities) {
            entity.update(deltaTime); // Asumiendo que tienes este método
        }

        // Forzar una sola actualización
        set({ entities: [...state.entities] });
    },

    // ✅ Para actualizaciones individuales ocasionales
    updateEntity: (id, updates) =>
        set((state) => ({
            entities: state.entities.map((entity) =>
                entity.id === id
                    ? new Entity({ ...entity.toProps(), ...updates })
                    : entity,
            ),
        })),

    updateSpecificPropOfEntity: (id, prop, value) => {
        set((state) => ({
            entities: state.entities.map((entity) => {
                if (entity.id !== id) return entity;

                // Extraemos todos los props actuales
                const props = entity.toProps();
                const [root, key] = prop.split('.') as [
                    (
                        | 'position'
                        | 'velocity'
                        | 'acceleration'
                        | 'radius'
                        | 'color'
                    ),
                    string,
                ];

                // Para campos anidados
                if (
                    root === 'position' ||
                    root === 'velocity' ||
                    root === 'acceleration'
                ) {
                    return new Entity({
                        ...props,
                        [root]: {
                            // mantenemos la otra coordenada y sustituimos solo la que toca
                            ...props[root],
                            [key]: value as number,
                        },
                    });
                }

                // Para campos de primer nivel (radius, color)
                return new Entity({
                    ...props,
                    [root]: value,
                });
            }),
        }));
    },

    deleteEntity: (id) =>
        set((state) => ({
            entities: state.entities.filter((e) => e.id !== id),
        })),

    addEntity: (props = {}) =>
        set((state) => ({
            entities: [
                ...state.entities,
                new Entity({
                    position: { x: 100, y: 300 },
                    velocity: { x: 0, y: 0 },
                    acceleration: { x: 0, y: 0 },
                    radius: 10,
                    color:
                        '#' +
                        Math.floor(Math.random() * 0xffffff)
                            .toString(16)
                            .padStart(6, '0'),
                    ...props,
                }),
            ],
        })),
}));

export { useEntityStore, type EntityStore };
