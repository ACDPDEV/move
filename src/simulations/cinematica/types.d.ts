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

interface MovilInterface {
    id?: string;
    position: Vector2D;
    velocity: Vector2D;
    acceleration: Vector2D;
    radius: number;
    color: string;

    constructor({ 
        id,
        position, 
        velocity, 
        acceleration,
        radius, 
        color
    });
    update(deltaTime: number): void;
    absoluteMoveAndScale(deltaPosition: { x: number, y: number }, scale: number): void;
    draw(ctx: CanvasRenderingContext2D): void;
    drawVelocityVector(ctx: CanvasRenderingContext2D, scale: number): void;
    drawAccelerationVector(ctx: CanvasRenderingContext2D, scale: number): void;
    toString(): string;
    getDebugInfo(): string;
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
  trayectories: boolean;
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
    MovilInterface,
    DisplayOptions,
    DeepPartial
}