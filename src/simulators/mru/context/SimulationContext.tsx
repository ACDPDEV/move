import { createContext } from 'preact';
import { useContext, useReducer, useCallback, useMemo, useRef } from 'preact/hooks';
import type { JSX } from 'preact';
import { Vector2D } from '@/lib/physicsUtils';
import { Movil, type IMovilProps } from '../entities/Movil';

type EntityMap = Map<string, Movil>;

// DEFINICIONES DE TIPOS

/**
 * Estado de la simulación
 * Contiene toda la información del estado actual de la simulación
 */
type SimulationState = {
  time: number;        // Tiempo transcurrido en segundos
  fps: number;         // Frames por segundo actuales
  speed: number;       // Multiplicador de velocidad de simulación
  isPlaying: boolean;  // Si la simulación está reproduciéndose
  entities: Movil[];   // Array de entidades en la simulación
  version: number;     // Version number for change detection
};

/**
 * Acciones disponibles para modificar el estado de la simulación
 */
type SimulationAction =
  | { type: 'PLAY' }
  | { type: 'PAUSE' }
  | { type: 'SET_SPEED'; payload: number }
  | { type: 'UPDATE_TIME'; payload: number }
  | { type: 'UPDATE_FPS'; payload: number }
  | { type: 'UPDATE_ENTITIES'; payload: Movil[] }
  | { type: 'UPDATE_ENTITY'; payload: { id: string; updates: Partial<IMovilProps> } }
  | { type: 'RESET' };

// TIPOS DE CONTEXTO

type SimulationActions = {
  play: () => void;
  pause: () => void;
  setSpeed: (speed: number) => void;
  updateTime: (time: number) => void;
  updateFPS: (fps: number) => void;
  updateEntities: (entities: Movil[]) => void;
  updateEntity: (id: string, updates: Partial<IMovilProps>) => void;
  resetSimulation: () => void;
};

type SimulationContextValue = {
  state: SimulationState;
  actions: SimulationActions;
};

// For backward compatibility
type SimulationContextType = SimulationContextValue;

// ESTADO INICIAL

/**
 * Estado inicial de la simulación con dos móviles de ejemplo
 */
const initialState: SimulationState = {
  time: 0,
  fps: 0,
  speed: 1.0,
  isPlaying: false,
  version: 0,
  entities: [
    new Movil({
      id: 'm1',
      position: new Vector2D(100, 300),
      velocity: new Vector2D(50, 0),     // MRU: velocidad constante
      acceleration: new Vector2D(0, 0),  // Sin aceleración
      radius: 15,
      color: 0xFF5733  // Naranja
    }),
    new Movil({
      id: 'm2',
      position: new Vector2D(100, 400),
      velocity: new Vector2D(30, 0),     // Velocidad inicial menor
      acceleration: new Vector2D(5, 0),  // MRUV: con aceleración
      radius: 15,
      color: 0x33A1FF  // Azul
    })
  ]
};

// CONTEXTO

/**
 * Contexto de simulación
 * Proporciona acceso al estado y acciones de la simulación a los componentes hijos
 */
const SimulationContext = createContext<SimulationContextValue | null>(null);

// REDUCER

/**
 * Reducer que maneja todas las acciones del estado de simulación
 * Implementa la lógica de actualización de estado de forma inmutable
 */
function simulationReducer(state: SimulationState, action: SimulationAction): SimulationState {
  switch (action.type) {
    case 'PLAY':
      return state.isPlaying ? state : { ...state, isPlaying: true };
      
    case 'PAUSE':
      return !state.isPlaying ? state : { ...state, isPlaying: false };
      
    case 'SET_SPEED':
      const newSpeed = Math.max(0.1, Math.min(3, action.payload));
      return state.speed === newSpeed ? state : { ...state, speed: newSpeed };
      
    case 'UPDATE_TIME':
      return state.time === action.payload ? state : { ...state, time: action.payload };
      
    case 'UPDATE_FPS':
      return state.fps === action.payload ? state : { ...state, fps: action.payload };
      
    case 'UPDATE_ENTITIES': {
      // Check if entities have actually changed
      const newEntities = action.payload.map(entity => 
        entity instanceof Movil ? entity : new Movil(entity)
      );
      
      // Only update if entities have changed
      if (state.entities.length === newEntities.length &&
          state.entities.every((e, i) => e === newEntities[i])) {
        return state;
      }
      
      return { 
        ...state, 
        entities: newEntities,
        version: state.version + 1
      };
    }
      
    case 'UPDATE_ENTITY': {
      const { id, updates } = action.payload;
      const entityIndex = state.entities.findIndex(e => e.id === id);
      
      if (entityIndex === -1) {
        // Si la entidad no existe, crear una nueva
        const newEntity = new Movil({
          id,
          position: new Vector2D(100, 300),
          velocity: new Vector2D(0, 0),
          acceleration: new Vector2D(0, 0),
          radius: 10,
          color: Math.floor(Math.random() * 0xFFFFFF),
          ...updates
        });
        
        return {
          ...state,
          entities: [...state.entities, newEntity],
          version: state.version + 1
        };
      }
      
      // Check if the entity actually needs to be updated
      const existingEntity = state.entities[entityIndex];
      let needsUpdate = false;
      
      // Check if any properties have changed
      for (const [key, value] of Object.entries(updates)) {
        if (key === 'position' || key === 'velocity' || key === 'acceleration') {
          if (value && typeof value === 'object' && 'x' in value && 'y' in value) {
            const vector = value as Vector2D;
            const currentVector = existingEntity[key] as Vector2D;
            if (vector.x !== currentVector.x || vector.y !== currentVector.y) {
              needsUpdate = true;
              break;
            }
          }
        } else if (existingEntity[key as keyof Movil] !== value) {
          needsUpdate = true;
          break;
        }
      }
      
      if (!needsUpdate) {
        return state;
      }
      
      // Update the entity
      const updatedEntity = new Movil({
        ...existingEntity,
        ...updates,
        // Ensure vectors remain as Vector2D instances
        position: updates.position instanceof Vector2D 
          ? updates.position 
          : existingEntity.position,
        velocity: updates.velocity instanceof Vector2D 
          ? updates.velocity 
          : existingEntity.velocity,
        acceleration: updates.acceleration instanceof Vector2D 
          ? updates.acceleration 
          : existingEntity.acceleration
      });
      
      const newEntities = [...state.entities];
      newEntities[entityIndex] = updatedEntity;
      
      return {
        ...state,
        entities: newEntities,
        version: state.version + 1
      };
    }
    
    case 'RESET':
      return {
        ...initialState,
        entities: initialState.entities.map(entity => new Movil(entity)),
        version: state.version + 1
      };
      
    default:
      return state;
  }
}

// PROVIDER

/**
 * Proveedor del contexto de simulación
 * Envuelve los componentes hijos y les proporciona acceso al estado y acciones
 */
export function SimulationProvider({ children }: { children: JSX.Element }) {
  const [state, dispatch] = useReducer(simulationReducer, initialState);
  
  // Keep track of the previous state version to prevent unnecessary re-renders
  const prevVersionRef = useRef(state.version);
  
  // Memoize the state to prevent unnecessary re-renders
  const memoizedState = useMemo(() => state, [state.version]);
  
  // Acciones memoizadas para evitar renders innecesarios
  const play = useCallback(() => {
    if (!state.isPlaying) {
      dispatch({ type: 'PLAY' });
    }
  }, [state.isPlaying]);
  
  const pause = useCallback(() => {
    if (state.isPlaying) {
      dispatch({ type: 'PAUSE' });
    }
  }, [state.isPlaying]);
  
  const setSpeed = useCallback((speed: number) => {
    if (state.speed !== speed) {
      dispatch({ type: 'SET_SPEED', payload: speed });
    }
  }, [state.speed]);
  
  const updateTime = useCallback((time: number) => {
    if (state.time !== time) {
      dispatch({ type: 'UPDATE_TIME', payload: time });
    }
  }, [state.time]);
    
  const updateFPS = useCallback((fps: number) => {
    // Only update FPS if it's changed significantly (more than 1 FPS)
    if (Math.abs(state.fps - fps) > 1) {
      dispatch({ type: 'UPDATE_FPS', payload: Math.round(fps) });
    }
  }, [state.fps]);
  
  const updateEntities = useCallback((newEntities: Movil[]) => {
    // Only update if the entities have actually changed
    if (state.entities.length !== newEntities.length ||
        !state.entities.every((e, i) => e === newEntities[i])) {
      dispatch({ type: 'UPDATE_ENTITIES', payload: newEntities });
    }
  }, [state.entities]);
  
  const updateEntity = useCallback((id: string, updates: Partial<IMovilProps>) => {
    // Only dispatch if there are actual updates
    if (Object.keys(updates).length > 0) {
      dispatch({ type: 'UPDATE_ENTITY', payload: { id, updates } });
    }
  }, []);

  const resetSimulation = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  // Create a stable reference to the context value
  const contextValue = useMemo(() => {
    // Only update the context value if the state version has changed
    if (prevVersionRef.current !== state.version) {
      prevVersionRef.current = state.version;
      return {
        state: memoizedState,
        actions: {
          play,
          pause,
          setSpeed,
          updateTime,
          updateFPS,
          updateEntities,
          updateEntity,
          resetSimulation,
        },
      };
    }
    
    // Return the previous context value if nothing has changed
    return null;
  }, [
    state.version,
    memoizedState,
    play,
    pause,
    setSpeed,
    updateTime,
    updateFPS,
    updateEntities,
    updateEntity,
    resetSimulation,
  ]);

  // Only update the context if the context value has changed
  const stableContextValue = useMemo<SimulationContextValue>(() => {
    return contextValue || {
      state: memoizedState,
      actions: {
        play,
        pause,
        setSpeed,
        updateTime,
        updateFPS,
        updateEntities,
        updateEntity,
        resetSimulation,
      },
    };
  }, [contextValue, memoizedState, play, pause, setSpeed, updateTime, updateFPS, 
      updateEntities, updateEntity, resetSimulation]);

  return (
    <SimulationContext.Provider value={stableContextValue}>
      {children}
    </SimulationContext.Provider>
  );
}

// HOOK PERSONALIZADO

/**
 * Hook personalizado para acceder al contexto de simulación
 * Proporciona una interfaz limpia y validación de uso correcto
 * 
 * @throws Error si se usa fuera de un SimulationProvider
 * @returns Objeto con el estado y acciones de la simulación
 */
export function useSimulation(): SimulationContextValue {
  const context = useContext(SimulationContext);
  
  if (!context) {
    throw new Error('useSimulation debe usarse dentro de un SimulationProvider');
  }
  
  // Memoize the context value to prevent unnecessary re-renders
  return useMemo(() => ({
    state: context.state,
    actions: context.actions
  }), [context.state.version]);
}

/**
 * Hook personalizado para acceder solo al estado de la simulación
 * Útil para componentes que solo necesitan leer el estado
 */
export function useSimulationState() {
  const context = useContext(SimulationContext);
  
  if (!context) {
    throw new Error('useSimulationState debe usarse dentro de un SimulationProvider');
  }
  
  return context.state;
}

/**
 * Hook personalizado para acceder solo a las acciones de la simulación
 * Útil para componentes que solo necesitan despachar acciones
 */
export function useSimulationActions() {
  const context = useContext(SimulationContext);
  
  if (!context) {
    throw new Error('useSimulationActions debe usarse dentro de un SimulationProvider');
  }
  
  return context.actions;
}

/**
 * Hook personalizado para acceder a una entidad específica por su ID
 */
export function useEntity(entityId: string) {
  const { state } = useSimulation();
  
  return useMemo(() => {
    return state.entities.find(e => e.id === entityId);
  }, [state.entities, entityId]);
}

/**
 * Hook personalizado para acceder a una propiedad específica de una entidad
 */
export function useEntityProperty<T extends keyof IMovilProps>(
  entityId: string, 
  property: T
): IMovilProps[T] | undefined {
  const entity = useEntity(entityId);
  return entity?.[property];
}