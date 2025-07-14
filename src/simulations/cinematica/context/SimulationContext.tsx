import { createContext } from 'preact';
import { useContext, useReducer, useCallback, useMemo } from 'preact/hooks';
import type { JSX } from 'preact';
import { Vector2D } from '@/simulations/lib/physicsUtils';
import { Movil, type IMovilProps } from '../entities/Movil';
import type { AbsolutePlaneState } from '../types';

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
  /** Estado del plano absoluto (posición y escala) */
  plane: AbsolutePlaneState;
  /** Indica si el plano fue reseteado recientemente */
  isReset: boolean;
  /** Indica el tiempo es un valor de entrada o un tiempo real */
  isInputTimeChanged: boolean;
  /** Indica si se está predeciendo el movimiento con el tiempo */
  movementPrediction: boolean;
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
 * - `UPDATE_SHOW_VECTORS`: Cambia si se muestran los vectores
 * - `UPDATE_PLANE`: Actualiza la posición y escala del plano
 * - `UPDATE_IS_RESET`: Cambia el estado isReset
 * - `UPDATE_IS_INPUT_TIME_CHANGED`: Cambia el estado inputIsTimeChanged
 * - `UPDATE_MOVEMENT_PREDICTION`: Cambia el estado movementPrediction
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
  | { type: 'UPDATE_SHOW_VECTORS'; payload: boolean }
  | { type: 'UPDATE_PLANE'; payload: AbsolutePlaneState }
  | { type: 'UPDATE_IS_RESET'; payload: boolean }
  | { type: 'UPDATE_IS_INPUT_TIME_CHANGED'; payload: boolean }
  | { type: 'UPDATE_MOVEMENT_PREDICTION'; payload: boolean };

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
  updateShowVectors: (show: boolean) => void;
  /** Actualiza la posición y escala del plano */
  updatePlane: (plane: AbsolutePlaneState) => void;
  /** Cambia el estado isReset */
  updateIsReset: (isReset: boolean) => void;
  /** Cambia el estado isInputTimeChanged */
  updateIsInputTimeChanged: (changed: boolean) => void;
  /** Cambia el estado timePrediction */  
  updateMovementPrediction: (prediction: boolean) => void;
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
      radius: 15,
      color: "#FF5733"   
    }),
    new Movil({
      id: 'm2',
      position: { x: 100, y: 30 },
      velocity: { x: 0, y: 1 },     
      acceleration: { x: 0, y: 1 },
      radius: 15,
      color: "#33A1FF"   
    }),
    new Movil({
      id: 'm3',
      position: { x: 200, y: 100 },
      velocity: { x: -10, y: -2 },     
      acceleration: { x: 2, y: -0.5 },
      radius: 15,
      color: "#FFFFFF"   
    })
  ],
  showVectors: false,
  plane: {
    position: { x: 400, y: 300 },
    scale: 1
  },
  isReset: false,
  isInputTimeChanged: false,
  movementPrediction: false,
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
      return {
        ...state,
        time: 0,
        isPlaying: false,
        plane: { position: { x: 400, y: 300 }, scale: 1 },
        isReset: true
      };
    case 'UPDATE_SHOW_VECTORS':
      return { ...state, showVectors: action.payload };
    case 'UPDATE_PLANE':
      return { ...state, plane: action.payload };
    case 'UPDATE_IS_RESET':
      return { ...state, isReset: action.payload };
    case 'UPDATE_IS_INPUT_TIME_CHANGED':
      return { ...state, isInputTimeChanged: action.payload };
    case 'UPDATE_MOVEMENT_PREDICTION':
      return { ...state, movementPrediction: action.payload };
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

  const updateShowVectors = useCallback((show: boolean) => {
    dispatch({ type: 'UPDATE_SHOW_VECTORS', payload: show });
  }, []);
  const updatePlane = useCallback((plane: AbsolutePlaneState) => {
    dispatch({ type: 'UPDATE_PLANE', payload: plane });
  }, []);
  const updateIsReset = useCallback((isReset: boolean) => {
    dispatch({ type: 'UPDATE_IS_RESET', payload: isReset });
  }, []);
  const updateIsInputTimeChanged = useCallback((changed: boolean) => {
    dispatch({ type: 'UPDATE_IS_INPUT_TIME_CHANGED', payload: changed });
  }, []);
  const updateMovementPrediction = useCallback((prediction: boolean) => {
    dispatch({ type: 'UPDATE_MOVEMENT_PREDICTION', payload: prediction });
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
    updateShowVectors,
    updatePlane,
    updateIsReset,
    updateIsInputTimeChanged,
    updateMovementPrediction,
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
    updateShowVectors,
    updatePlane,
    updateIsReset,
    updateIsInputTimeChanged,
    updateMovementPrediction,
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