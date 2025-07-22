import { Vector2D } from "../lib/physicsUtils";
interface Ticker {
    timeCount: number;
    lastTime: number;
    frameCount: number;
    fps: number;
    lastFpsUpdate: number;
    deltaTime: number;
}

interface MouseState {
    isDown: boolean;
    startPosition: { x: number, y: number };
    currentPosition: { x: number, y: number };
    deltaPosition: { x: number, y: number };
}

interface AbsolutePlaneState {
    position: { x: number, y: number };
    scale: number;
}

interface CanvasConfig {
    MIN_SCALE: number;
    MAX_SCALE: number;
    GRID_SIZE: number;
    ZOOM_SENSITIVITY: number;
    MAX_GRID_LINES: number;
}

interface TimeControlsProps {
    isPlaying: boolean;
    time: number;
    speed: number;
    onPlayPause: () => void;
    onReset: () => void;
    onSpeedChange: (speed: number) => void;
    onSpeedUp: () => void;
    onSpeedDown: () => void;
}

type DisplayOptions = {
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
  trajectory: boolean;
  coordinates: boolean;
  axes: boolean;
};

type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};


export type {
    Ticker,
    MouseState,
    AbsolutePlaneState,
    CanvasConfig,
    TimeControlsProps,
    DisplayOptions,
    DeepPartial
}