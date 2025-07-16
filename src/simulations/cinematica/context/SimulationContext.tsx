import { createContext } from 'preact';
import { useContext, useReducer, useCallback, useMemo } from 'preact/hooks';
import type { JSX } from 'preact';
import { Vector2D } from '@/simulations/lib/physicsUtils';
import { Movil, type IMovilProps } from '../entities/Movil';
import type { AbsolutePlaneState, DeepPartial } from '../types';

// Definición de opciones de visualización
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

// Estado de la simulación
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

// Acciones para la simulación
export type SimulationAction =
  | { type: 'PLAY' }
  | { type: 'PAUSE' }
  | { type: 'SET_SPEED'; payload: number }
  | { type: 'UPDATE_TIME'; payload: number }
  | { type: 'UPDATE_FPS'; payload: number }
  | { type: 'UPDATE_ENTITIES'; payload: Movil[] }
  | { type: 'UPDATE_ENTITY'; payload: { id: string; updates: Partial<IMovilProps> } }
  | { type: 'RESET' }
  | { type: 'UPDATE_DISPLAY_OPTIONS'; payload: DeepPartial<DisplayOptions> }
  | { type: 'UPDATE_PLANE'; payload: AbsolutePlaneState }
  | { type: 'UPDATE_IS_RESET'; payload: boolean }
  | { type: 'UPDATE_IS_INPUT_TIME_CHANGED'; payload: boolean }
  | { type: 'UPDATE_MOVEMENT_PREDICTION'; payload: boolean };

// Contexto de simulación
export interface SimulationContextType {
  state: SimulationState;
  play: () => void;
  pause: () => void;
  setSpeed: (speed: number) => void;
  updateTime: (time: number) => void;
  updateFPS: (fps: number) => void;
  updateEntities: (entities: Movil[]) => void;
  updateEntity: (id: string, updates: Partial<IMovilProps>) => void;
  resetSimulation: () => void;
  updateDisplayOptions: (options: DeepPartial<DisplayOptions>) => void;
  updatePlane: (plane: AbsolutePlaneState) => void;
  updateIsReset: (isReset: boolean) => void;
  updateIsInputTimeChanged: (changed: boolean) => void;
  updateMovementPrediction: (prediction: boolean) => void;
}

// Estado inicial
const initialState: SimulationState = {
  time: 0,
  fps: 0,
  speed: 1.0,
  isPlaying: false,
  entities: [
    new Movil({ id: 'm1', position: { x: 100, y: 100 }, velocity: { x: 1, y: 0 }, acceleration: { x: 0, y: 1 }, radius: 15, color: '#FF5733' }),
    new Movil({ id: 'm2', position: { x: 100, y: 30 }, velocity: { x: 0, y: 1 }, acceleration: { x: 0, y: 1 }, radius: 15, color: '#33A1FF' }),
    new Movil({ id: 'm3', position: { x: 200, y: 100 }, velocity: { x: -10, y: -2 }, acceleration: { x: 2, y: -0.5 }, radius: 15, color: '#FFFFFF' }),
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

const SimulationContext = createContext<SimulationContextType | undefined>(undefined);

// Reducer de simulación
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
      return { ...state, entities: action.payload.map(e => e instanceof Movil ? e : new Movil(e)) };
    case 'UPDATE_ENTITY': {
      const { id, updates } = action.payload;
      const idx = state.entities.findIndex(e => e.id === id);
      if (idx === -1) {
        const newEntity = new Movil({ id, position: { x: 100, y: 300 }, velocity: { x: 0, y: 0 }, acceleration: { x: 0, y: 0 }, radius: 10, color: '#' + Math.floor(Math.random() * 0xFFFFFF).toString(16).padStart(6, '0'), ...updates });
        return { ...state, entities: [...state.entities, newEntity] };
      }
      const updated = [...state.entities];
      const entity = updated[idx];
      if (updates.position) entity.position = updates.position instanceof Vector2D ? updates.position : new Vector2D(updates.position.x, updates.position.y);
      if (updates.velocity) entity.velocity = updates.velocity instanceof Vector2D ? updates.velocity : new Vector2D(updates.velocity.x, updates.velocity.y);
      if (updates.acceleration) entity.acceleration = updates.acceleration instanceof Vector2D ? updates.acceleration : new Vector2D(updates.acceleration.x, updates.acceleration.y);
      if (updates.radius !== undefined) entity.radius = updates.radius;
      if (updates.color !== undefined) entity.color = updates.color;
      return { ...state, entities: updated };
    }
    case 'UPDATE_DISPLAY_OPTIONS': {
      // Deep merge parcial de displayOptions
      const merge = (orig: any, partial: any): any => {
        const result = { ...orig };
        Object.keys(partial).forEach(key => {
          if (partial[key] && typeof partial[key] === 'object' && !Array.isArray(partial[key])) {
            result[key] = merge(orig[key], partial[key]);
          } else {
            result[key] = partial[key] as any;
          }
        });
        return result;
      };
      return { ...state, displayOptions: merge(state.displayOptions, action.payload) };
    }
    case 'RESET':
      return { ...state, time: 0, isPlaying: false, plane: { position: { x: 400, y: 300 }, scale: 1 }, isReset: true };
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

// Proveedor
export function SimulationProvider({ children }: { children: JSX.Element }) {
  const [state, dispatch] = useReducer(simulationReducer, initialState);

  const play = useCallback(() => dispatch({ type: 'PLAY' }), []);
  const pause = useCallback(() => dispatch({ type: 'PAUSE' }), []);
  const setSpeed = useCallback((speed: number) => dispatch({ type: 'SET_SPEED', payload: speed }), []);
  const updateTime = useCallback((time: number) => dispatch({ type: 'UPDATE_TIME', payload: time }), []);
  const updateFPS = useCallback((fps: number) => dispatch({ type: 'UPDATE_FPS', payload: fps }), []);
  const updateEntities = useCallback((entities: Movil[]) => dispatch({ type: 'UPDATE_ENTITIES', payload: entities }), []);
  const updateEntity = useCallback((id: string, updates: Partial<IMovilProps>) => dispatch({ type: 'UPDATE_ENTITY', payload: { id, updates } }), []);
  const resetSimulation = useCallback(() => dispatch({ type: 'RESET' }), []);
  const updateDisplayOptions = useCallback((options: DeepPartial<DisplayOptions>) => dispatch({ type: 'UPDATE_DISPLAY_OPTIONS', payload: options }), []);
  const updatePlane = useCallback((plane: AbsolutePlaneState) => dispatch({ type: 'UPDATE_PLANE', payload: plane }), []);
  const updateIsReset = useCallback((isReset: boolean) => dispatch({ type: 'UPDATE_IS_RESET', payload: isReset }), []);
  const updateIsInputTimeChanged = useCallback((changed: boolean) => dispatch({ type: 'UPDATE_IS_INPUT_TIME_CHANGED', payload: changed }), []);
  const updateMovementPrediction = useCallback((prediction: boolean) => dispatch({ type: 'UPDATE_MOVEMENT_PREDICTION', payload: prediction }), []);

  const value = useMemo(
    () => ({ state, play, pause, setSpeed, updateTime, updateFPS, updateEntities, updateEntity, resetSimulation, updateDisplayOptions, updatePlane, updateIsReset, updateIsInputTimeChanged, updateMovementPrediction }),
    [state]
  );

  return <SimulationContext.Provider value={value}>{children}</SimulationContext.Provider>;
}

// Hook personalizado
export function useSimulation(): SimulationContextType {
  const context = useContext(SimulationContext);
  if (!context) throw new Error('useSimulation debe usarse dentro de SimulationProvider');
  return context;
}
