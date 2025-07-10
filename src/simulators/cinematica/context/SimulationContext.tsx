import { createContext } from 'preact';
import { useContext, useReducer, useCallback, useMemo } from 'preact/hooks';
import type { JSX } from 'preact';
import { Vector2D } from '@/lib/physicsUtils';
import { Movil, type IMovilProps } from '../entities/Movil';

//* DEFINICIONES DE TIPOS

/**
 * Estado de la simulación
 * @interface SimulationState
 */
type SimulationState = {
  /** Tiempo transcurrido en segundos */
  time: number;
  /** Frames por segundo actuales */
  fps: number;
  /** Multiplicador de velocidad de simulación (0.1 - 3.0) */
  speed: number;
  /** Si la simulación está reproduciéndose */
  isPlaying: boolean;
  /** Array de entidades en la simulación */
  entities: Movil[];
  /** Si se muestran los vectores de posición, velocidad y aceleración */
  showVectors: boolean;
};

/**
 * Acciones disponibles para el reducer de simulación
 * @description Tipos de acciones:
 * - `PLAY`: Inicia la simulación
 * - `PAUSE`: Pausa la simulación
 * - `SET_SPEED`: Actualiza el factor de velocidad (limitado entre 0.1 y 3.0)
 * - `UPDATE_TIME`: Actualiza el tiempo transcurrido en segundos
 * - `UPDATE_FPS`: Actualiza el número de frames por segundo
 * - `UPDATE_ENTITIES`: Reemplaza todas las entidades
 * - `UPDATE_ENTITY`: Actualiza una entidad específica por ID (crea nueva si no existe)
 * - `RESET`: Reinicia la simulación al estado inicial
 * - `SET_SHOW_VECTORS`: Cambia si se muestran los vectores
 */
type SimulationAction =
  | { type: 'PLAY' }
  | { type: 'PAUSE' }
  | { type: 'SET_SPEED'; payload: number }
  | { type: 'UPDATE_TIME'; payload: number }
  | { type: 'UPDATE_FPS'; payload: number }
  | { type: 'UPDATE_ENTITIES'; payload: Movil[] }
  | { type: 'UPDATE_ENTITY'; payload: { id: string; updates: Partial<IMovilProps> } }
  | { type: 'RESET' }
  | { type: 'SET_SHOW_VECTORS'; payload: boolean };

/**
 * Interfaz del contexto de simulación
 * @interface SimulationContextType
 */
interface SimulationContextType {
  /** Estado actual de la simulación */
  state: SimulationState;
  /** Inicia la simulación */
  play: () => void;
  /** Pausa la simulación */
  pause: () => void;
  /** Actualiza el factor de velocidad */
  setSpeed: (speed: number) => void;
  /** Actualiza el tiempo transcurrido */
  updateTime: (time: number) => void;
  /** Actualiza los frames por segundo */
  updateFPS: (fps: number) => void;
  /** Reemplaza todas las entidades */
  updateEntities: (entities: Movil[]) => void;
  /** Actualiza una entidad específica */
  updateEntity: (id: string, updates: Partial<IMovilProps>) => void;
  /** Reinicia la simulación */
  resetSimulation: () => void;
  /** Cambia si se muestran los vectores */
  setShowVectors: (show: boolean) => void;
}

//* ESTADO INICIAL

/**
 * Estado inicial de la simulación con tres móviles de ejemplo
 * @constant initialState
 * @description Configuración inicial con tres móviles que demuestran diferentes tipos de movimiento
 * @example
 * ```ts
 * // Móvil 1 (rojo): Movimiento horizontal con aceleración vertical
 * // Móvil 2 (azul): Movimiento vertical con aceleración vertical
 * // Móvil 3 (blanco): Movimiento diagonal con aceleración compleja
 * ```
 */
const initialState: SimulationState = {
  time: 0,
  fps: 0,
  speed: 1.0,
  isPlaying: false,
  entities: [
    new Movil({
      id: 'm1',
      position: { x: 100, y: 100 },
      velocity: { x: 1, y: 0 },    
      acceleration: { x: 0, y: 1 },
      radius: 5,
      color: "#FF5733"   
    }),
    new Movil({
      id: 'm2',
      position: { x: 100, y: 30 },
      velocity: { x: 0, y: 1 },     
      acceleration: { x: 0, y: 1 },
      radius: 5,
      color: "#33A1FF"   
    }),
    new Movil({
      id: 'm3',
      position: { x: 200, y: 100 },
      velocity: { x: -10, y: -2 },     
      acceleration: { x: 2, y: -0.5 },
      radius: 5,
      color: "#FFFFFF"   
    })
  ],
  showVectors: false
};

//* CONTEXTO

/**
 * Contexto de React para la simulación
 * @constant SimulationContext
 * @description Contexto que proporciona acceso global al estado y acciones de la simulación
 */
const SimulationContext = createContext<SimulationContextType | undefined>(undefined);

//* REDUCER

/**
 * Reducer que maneja todas las acciones del estado de simulación
 * @param state Estado actual de la simulación
 * @param action Acción a realizar
 * @returns Nuevo estado de la simulación
 * @example
 * ```ts
 * const newState = simulationReducer(currentState, { type: 'PLAY' });
 * const speedState = simulationReducer(currentState, { type: 'SET_SPEED', payload: 2.0 });
 * ```
 */
function simulationReducer(state: SimulationState, action: SimulationAction): SimulationState {
  switch (action.type) {
    case 'PLAY':
      return { ...state, isPlaying: true };
    case 'PAUSE':
      return { ...state, isPlaying: false };
    case 'SET_SPEED':
      return { ...state, speed: Math.max(0.1, Math.min(3, action.payload)) };
    case 'UPDATE_TIME':
      return { ...state, time: action.payload };
    case 'UPDATE_FPS':
      return { ...state, fps: action.payload };
    case 'UPDATE_ENTITIES':
      return { 
        ...state, 
        entities: action.payload.map(entity => 
          entity instanceof Movil ? entity : new Movil(entity)
        ) 
      };
    case 'UPDATE_ENTITY': {
      const { id, updates } = action.payload;
      const entityIndex = state.entities.findIndex(e => e.id === id);
      
      if (entityIndex === -1) {
        // Si la entidad no existe, crear una nueva
        const newEntity = new Movil({
          id,
          position: { x: 100, y: 300 },
          velocity: { x: 0, y: 0 },
          acceleration: { x: 0, y: 0 },
          radius: 10,
          color: "#" + Math.floor(Math.random() * 0xFFFFFF).toString(16).padStart(6, '0'),
          ...updates
        });
        
        return {
          ...state,
          entities: [...state.entities, newEntity]
        };
      }
    
      const existingEntity = state.entities[entityIndex];
      const newEntities = [...state.entities];
      
      // Actualizar directamente las propiedades del objeto existente
      if (updates.position) {
        existingEntity.position = updates.position instanceof Vector2D 
          ? updates.position 
          : new Vector2D(updates.position.x, updates.position.y);
      }
      
      if (updates.velocity) {
        existingEntity.velocity = updates.velocity instanceof Vector2D 
          ? updates.velocity 
          : new Vector2D(updates.velocity.x, updates.velocity.y);
      }
      
      if (updates.acceleration) {
        existingEntity.acceleration = updates.acceleration instanceof Vector2D 
          ? updates.acceleration 
          : new Vector2D(updates.acceleration.x, updates.acceleration.y);
      }
      
      if (updates.radius !== undefined) {
        existingEntity.radius = updates.radius;
      }
      
      if (updates.color !== undefined) {
        existingEntity.color = updates.color;
      }
      
      return {
        ...state,
        entities: newEntities
      };
    }
    case 'RESET':
      // Resetear todas las entidades a su estado inicial
      const resetEntities = state.entities.map(entity => {
        entity.reset();
        return entity;
      });
      
      return {
        ...state,
        time: 0,
        isPlaying: false,
        entities: resetEntities
      };
    case 'SET_SHOW_VECTORS':
      return { ...state, showVectors: action.payload };
    default:
      return state;
  }
}

//* PROVIDER

/**
 * Proveedor del contexto de simulación
 * @param children Componentes hijos que tendrán acceso al contexto
 * @returns Elemento proveedor con el contexto de simulación
 * @example
 * ```tsx
 * <SimulationProvider>
 *   <SimulationCanvas />
 *   <SimulationControls />
 * </SimulationProvider>
 * ```
 */
export function SimulationProvider({ children }: { children: JSX.Element }) {
  const [state, dispatch] = useReducer(simulationReducer, initialState);
  
  const play = useCallback(() => {
    dispatch({ type: 'PLAY' });
  }, []);
  
  const pause = useCallback(() => {
    dispatch({ type: 'PAUSE' });
  }, []);
  
  const setSpeed = useCallback((speed: number) => {
    dispatch({ type: 'SET_SPEED', payload: speed });
  }, []);
  
  const updateTime = useCallback((time: number) => {
    dispatch({ type: 'UPDATE_TIME', payload: time });
  }, []);
    
  const updateFPS = useCallback((fps: number) => {
    dispatch({ type: 'UPDATE_FPS', payload: fps });
  }, []);
  
  const updateEntities = useCallback((entities: Movil[]) => {
    dispatch({ type: 'UPDATE_ENTITIES', payload: entities });
  }, []);
  
  const updateEntity = useCallback((id: string, updates: Partial<IMovilProps>) => {
    dispatch({ type: 'UPDATE_ENTITY', payload: { id, updates } });
  }, []);

  const resetSimulation = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  const setShowVectors = useCallback((show: boolean) => {
    dispatch({ type: 'SET_SHOW_VECTORS', payload: show });
  }, []);

  const contextValue = useMemo(() => ({
    state,
    play,
    pause,
    setSpeed,
    updateTime,
    updateFPS,
    updateEntities,
    updateEntity,
    resetSimulation,
    setShowVectors,
  }), [
    state,
    play,
    pause,
    setSpeed,
    updateTime,
    updateFPS,
    updateEntities,
    updateEntity,
    resetSimulation,
    setShowVectors,
  ]);

  return (
    <SimulationContext.Provider value={contextValue}>
      {children}
    </SimulationContext.Provider>
  );
}

//* CUSTOM HOOK

/**
 * Hook personalizado para acceder al contexto de simulación
 * @returns Objeto con el estado y acciones de la simulación
 * @throws {Error} Si se usa fuera de un SimulationProvider
 * @example
 * ```ts
 * const { state, play, pause } = useSimulation();
 * 
 * // Usar el estado
 * console.log(state.isPlaying, state.time);
 * 
 * // Controlar la simulación
 * play();
 * pause();
 * setSpeed(2.0);
 * ```
 */
export function useSimulation(): SimulationContextType {
  const context = useContext(SimulationContext);
  
  if (!context) {
    throw new Error('useSimulation debe usarse dentro de un SimulationProvider');
  }
  
  return context;
}