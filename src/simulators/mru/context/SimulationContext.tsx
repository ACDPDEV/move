import { createContext } from 'preact';
import { useContext, useReducer, useCallback, useMemo } from 'preact/hooks';
import type { JSX } from 'preact';
import { Vector2D } from '@/lib/physicsUtils';
import { Movil, type IMovilProps } from '../entities/Movil';

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

/**
 * Interfaz del contexto de simulación
 * Define todos los métodos y propiedades disponibles para los componentes
 */
interface SimulationContextType {
  state: SimulationState;
  play: () => void;
  pause: () => void;
  setSpeed: (speed: number) => void;
  updateTime: (time: number) => void;
  updateFPS: (fps: number) => void;
  updateEntities: (entities: Movil[]) => void;
  updateEntity: (id: string, updates: Partial<IMovilProps>) => void;
  resetSimulation: () => void;
}

// ESTADO INICIAL

/**
 * Estado inicial de la simulación con dos móviles de ejemplo
 */
const initialState: SimulationState = {
  time: 0,
  fps: 0,
  speed: 1.0,
  isPlaying: false,
  entities: [
    new Movil({
      id: 'm1',
      position: new Vector2D(100, 100),
      velocity: new Vector2D(1, 0),    
      acceleration: new Vector2D(0, 1),  
      radius: 5,
      color: "#FF5733"   
    }),
    new Movil({
      id: 'm2',
      position: new Vector2D(100, 30),
      velocity: new Vector2D(0, 1),     
      acceleration: new Vector2D(0, 1),  
      radius: 5,
      color: "#33A1FF"   
    }),
    new Movil({
      id: 'm3',
      position: new Vector2D(200, 100),
      velocity: new Vector2D(-10, -2),     
      acceleration: new Vector2D(2, -0.5),  
      radius: 5,
      color: "#FFFFFF"   
    })
  ]
};

// CONTEXTO

/**
 * Contexto de React para la simulación
 * Inicialmente undefined, debe usarse dentro de un SimulationProvider
 */
const SimulationContext = createContext<SimulationContextType | undefined>(undefined);

// REDUCER

/**
 * Reducer que maneja todas las acciones del estado de simulación
 * Implementa la lógica de actualización de estado de forma inmutable
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
          position: new Vector2D(100, 300),
          velocity: new Vector2D(0, 0),
          acceleration: new Vector2D(0, 0),
          radius: 10,
          color: "#" + Math.floor(Math.random() * 0xFFFFFF).toString(16).padStart(6, '0'),
          ...updates
        });
        
        return {
          ...state,
          entities: [...state.entities, newEntity]
        };
      }
      
      // Actualizar entidad existente - AQUÍ ESTÁ EL FIX
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
        existingEntity._radius = updates.radius;
      }
      
      if (updates.color !== undefined) {
        existingEntity._color = updates.color;
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
  
  // Acciones memoizadas para evitar renders innecesarios
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

  // Valor del contexto memoizado para optimización
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
  ]);

  return (
    <SimulationContext.Provider value={contextValue}>
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
export function useSimulation(): SimulationContextType {
  const context = useContext(SimulationContext);
  
  if (!context) {
    throw new Error('useSimulation debe usarse dentro de un SimulationProvider');
  }
  
  return context;
}