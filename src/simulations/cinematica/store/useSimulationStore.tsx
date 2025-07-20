import { create } from 'zustand';
import { Vector2D } from '@/simulations//lib/utils';
import { Movil, type IMovilProps } from '../entities/Movil';
import type { AbsolutePlaneState, DeepPartial } from '../types';
import { v4 as uuidv4 } from 'uuid';

// Definición de opciones de visualización (igual que antes)
export type DisplayOptions = {
    position: {
        resultant: boolean;
        components: boolean;
        angle: boolean;
    };
    velocity: {
        resultant: boolean;
        components: boolean;
        angle: boolean;
    };
    acceleration: {
        resultant: boolean;
        components: boolean;
        angle: boolean;
    };
    trayectories: boolean;
    coordinates: boolean;
    axes: boolean;
};

// Estado de la simulación (igual que antes)
export type SimulationState = {
    time: number;
    fps: number;
    speed: number;
    isPlaying: boolean;
    entities: Movil[];
    displayOptions: DisplayOptions;
    plane: AbsolutePlaneState;
    isReset: boolean;
    isInputTimeChanged: boolean;
    movementPrediction: boolean;
};

// Interfaz para el store de Zustand: estado + acciones
export interface SimulationStore extends SimulationState {
    play: () => void;
    pause: () => void;
    setSpeed: (speed: number) => void;
    updateTime: (time: number) => void;
    updateFPS: (fps: number) => void;
    updateEntities: (entities: Movil[]) => void;
    updateEntity: (id: string, updates: Partial<IMovilProps>) => void;
    deleteEntity: (id: string) => void;
    addEntity: (type: string) => void;
    resetSimulation: () => void;
    updateDisplayOptions: (options: DeepPartial<DisplayOptions>) => void;
    updatePlane: (plane: AbsolutePlaneState) => void;
    updateIsReset: (isReset: boolean) => void;
    updateIsInputTimeChanged: (changed: boolean) => void;
    updateMovementPrediction: (prediction: boolean) => void;
}

// Estado inicial (igual que antes)
const initialState: SimulationState = {
    time: 0,
    fps: 0,
    speed: 1.0,
    isPlaying: false,
    entities: [
        new Movil({ id: uuidv4(), position: { x: 100, y: 300 }, velocity: { x: 100, y: 0 }, acceleration: { x: 0, y: 0 }, radius: 10, color: '#' + Math.floor(Math.random() * 0xFFFFFF).toString(16).padStart(6, '0') }),
        new Movil({ id: uuidv4(), position: { x: 200, y: 300 }, velocity: { x: 0, y: 100 }, acceleration: { x: 0, y: 0 }, radius: 10, color: '#' + Math.floor(Math.random() * 0xFFFFFF).toString(16).padStart(6, '0') }),
        new Movil({ id: uuidv4(), position: { x: 300, y: 300 }, velocity: { x: 100, y: 100 }, acceleration: { x: 0, y: 0 }, radius: 10, color: '#' + Math.floor(Math.random() * 0xFFFFFF).toString(16).padStart(6, '0') }),
    ],
    displayOptions: {
        position: { resultant: false, components: false, angle: false },
        velocity: { resultant: false, components: false, angle: false },
        acceleration: { resultant: false, components: false, angle: false },
        trayectories: false,
        coordinates: false,
        axes: false,
    },
    plane: { position: { x: 400, y: 300 }, scale: 1 },
    isReset: false,
    isInputTimeChanged: false,
    movementPrediction: false,
};

// Función de ayuda para la fusión profunda de opciones de visualización
const deepMerge = (orig: any, partial: any): any => {
    const result = { ...orig };
    Object.keys(partial).forEach(key => {
        if (partial[key] && typeof partial[key] === 'object' && !Array.isArray(partial[key])) {
            result[key] = deepMerge(orig[key], partial[key]);
        } else {
            result[key] = partial[key] as any;
        }
    });
    return result;
};


// Crea tu store de Zustand
export const useSimulationStore = create<SimulationStore>((set, get) => ({
    ...initialState, // El estado inicial
    
    // Acciones de la simulación
    play: () => set({ isPlaying: true }),
    pause: () => set({ isPlaying: false }),
    setSpeed: (speed) => set({ speed: Math.max(0.1, Math.min(3, speed)) }),
    updateTime: (time) => set({ time }),
    updateFPS: (fps) => set({ fps }),
    updateEntities: (entities) => set({ entities: entities.map(e => e instanceof Movil ? e : new Movil(e)) }),
    updateEntity: (id, updates) => set(state => {
        const idx = state.entities.findIndex(e => e.id === id);
        if (idx === -1) {
            // Si la entidad no existe, la crea y la añade
            const newEntity = new Movil({ id, position: { x: 100, y: 300 }, velocity: { x: 0, y: 0 }, acceleration: { x: 0, y: 0 }, radius: 10, color: '#' + Math.floor(Math.random() * 0xFFFFFF).toString(16).padStart(6, '0'), ...updates });
            return { entities: [...state.entities, newEntity] };
        }
        // Si la entidad existe, actualiza sus propiedades
        const updatedEntities = [...state.entities];
        const entityToUpdate = updatedEntities[idx];

        // Crear una nueva instancia de Movil o Vector2D si es necesario para asegurar la inmutabilidad
        const updatedEntity = new Movil({ ...entityToUpdate }); // Clonar la entidad para la inmutabilidad

        if (updates.position) updatedEntity.position = updates.position instanceof Vector2D ? updates.position : new Vector2D(updates.position.x, updates.position.y);
        if (updates.velocity) updatedEntity.velocity = updates.velocity instanceof Vector2D ? updates.velocity : new Vector2D(updates.velocity.x, updates.velocity.y);
        if (updates.acceleration) updatedEntity.acceleration = updates.acceleration instanceof Vector2D ? updates.acceleration : new Vector2D(updates.acceleration.x, updates.acceleration.y);
        if (updates.radius !== undefined) updatedEntity.radius = updates.radius;
        if (updates.color !== undefined) updatedEntity.color = updates.color;
        
        updatedEntities[idx] = updatedEntity; // Reemplazar la entidad en la copia del array
        return { entities: updatedEntities };
    }),
    deleteEntity: (id: string) => set(state => {
        const updatedEntities = [...state.entities];
        const idx = updatedEntities.findIndex(e => e.id === id);
        if (idx !== -1) {
            updatedEntities.splice(idx, 1);
        }
        return { entities: updatedEntities };
    }),
    addEntity: (_type: string) => set(state => {
        const newEntity = new Movil({ id: uuidv4(), position: { x: 100, y: 300 }, velocity: { x: 0, y: 0 }, acceleration: { x: 0, y: 0 }, radius: 10, color: '#' + Math.floor(Math.random() * 0xFFFFFF).toString(16).padStart(6, '0') });
        return { entities: [...state.entities, newEntity] };
    }),
    updateDisplayOptions: (options) => set(state => ({ displayOptions: deepMerge(state.displayOptions, options) })),
    resetSimulation: () => set({ 
        time: 0, 
        isPlaying: false, 
        plane: { position: { x: 400, y: 300 }, scale: 1 }, 
        isReset: true,
        // Opcional: si quieres resetear las entidades a su estado inicial también:
        // entities: initialState.entities.map(e => new Movil(e)) 
    }),
    updatePlane: (plane) => set({ plane }),
    updateIsReset: (isReset) => set({ isReset }),
    updateIsInputTimeChanged: (changed) => set({ isInputTimeChanged: changed }),
    updateMovementPrediction: (prediction) => set({ movementPrediction: prediction }),
}));