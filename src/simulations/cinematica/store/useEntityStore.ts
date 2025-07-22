import { create } from 'zustand';
import {
    Entity,
    type EntityProps,
} from '@/simulations/cinematica/entities/Entity';
import { Vector2D } from '@/simulations/lib/utils';

type EntityStore = {
    entities: Entity[];
    updateEntities: (entities: Entity[]) => void;
    updateEntity: (id: string, updates: Partial<EntityProps>) => void;
    deleteEntity: (id: string) => void;
    addEntity: (props?: Partial<EntityProps>) => void;
};

export const useEntityStore = create<EntityStore>((set) => ({
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

    // ✅ CORRECCIÓN CRÍTICA: Crear nuevas instancias para que React detecte cambios
    updateEntity: (id, updates) =>
        set((state) => {
            console.log('🔄 Store updateEntity called:', { id, updates });

            const entityIndex = state.entities.findIndex((e) => e.id === id);
            if (entityIndex === -1) {
                console.log('❌ Entity not found:', id);
                return state;
            }

            const currentEntity = state.entities[entityIndex];
            console.log('📋 Current entity:', currentEntity);

            // ✅ Crear completamente nueva instancia de Entity
            const newEntity = new Entity({
                ...currentEntity, // Spread todas las propiedades actuales
                ...updates, // Override con las actualizaciones
                // Asegurarse de que los vectores sean instancias correctas
                position: updates.position
                    ? updates.position instanceof Vector2D
                        ? updates.position
                        : new Vector2D(updates.position.x, updates.position.y)
                    : currentEntity.position,
                velocity: updates.velocity
                    ? updates.velocity instanceof Vector2D
                        ? updates.velocity
                        : new Vector2D(updates.velocity.x, updates.velocity.y)
                    : currentEntity.velocity,
                acceleration: updates.acceleration
                    ? updates.acceleration instanceof Vector2D
                        ? updates.acceleration
                        : new Vector2D(
                              updates.acceleration.x,
                              updates.acceleration.y,
                          )
                    : currentEntity.acceleration,
            });

            console.log('✅ New entity created:', newEntity);

            // ✅ Crear nuevo array de entidades
            const newEntities = [...state.entities];
            newEntities[entityIndex] = newEntity;

            console.log('📦 Updated entities array:', newEntities);

            return { entities: newEntities };
        }),

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
