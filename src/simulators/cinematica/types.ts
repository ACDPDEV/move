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

export type {
    Ticker,
    MouseState,
    AbsolutePlaneState,
    CanvasConfig,
    TimeControlsProps,
}