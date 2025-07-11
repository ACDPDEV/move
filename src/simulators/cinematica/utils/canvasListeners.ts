import { resizeCanvas } from '@/simulators/cinematica/utils/canvasManagment';
import type { MouseState, AbsolutePlaneState, CanvasConfig } from '@/simulators/cinematica/types';

function listenCanvasEvents($canvas: HTMLCanvasElement) {
    // Callbacks
    const handleResize = () => resizeCanvas($canvas);

    handleResize();

    // Event listeners
    window.addEventListener('resize', handleResize);

    // Cleanup function
    const cleanup = () => {
        window.removeEventListener('resize', handleResize);
    };

    return cleanup;
}

function listenMouseEvents(
    $canvas: HTMLCanvasElement,
    Mouse: MouseState,
    AbsolutePlane: AbsolutePlaneState,
    CANVAS_CONFIG: CanvasConfig,
    updatePlane: (plane: AbsolutePlaneState) => void,
) {
    // Callbacks
    const handleMouseDown = (event: MouseEvent) => {
        Mouse.isDown = true;
        Mouse.startPosition = { x: event.offsetX, y: event.offsetY };
        Mouse.currentPosition = { x: event.offsetX, y: event.offsetY };
    };
    
    const handleMouseMove = (event: MouseEvent) => {
        if (!Mouse.isDown) return;
        
        const deltaX = event.offsetX - Mouse.currentPosition.x;
        const deltaY = event.offsetY - Mouse.currentPosition.y;
        
        Mouse.deltaPosition = { x: deltaX, y: deltaY };
        Mouse.currentPosition = { x: event.offsetX, y: event.offsetY };
        
        AbsolutePlane.position.x += deltaX / AbsolutePlane.scale;
        AbsolutePlane.position.y += deltaY / AbsolutePlane.scale;

        updatePlane(AbsolutePlane);
    };
    
    const handleMouseUp = () => {
        Mouse.isDown = false;
        Mouse.deltaPosition = { x: 0, y: 0 };
    };
    
    const handleWheel = (event: WheelEvent) => {
        event.preventDefault();
        
        const zoomFactor = event.deltaY * CANVAS_CONFIG.ZOOM_SENSITIVITY;
        const newScale = Math.max(
            CANVAS_CONFIG.MIN_SCALE,
            Math.min(CANVAS_CONFIG.MAX_SCALE, AbsolutePlane.scale - zoomFactor)
        );
        
        AbsolutePlane.scale = newScale;
    };

    // Event listeners
    $canvas.addEventListener('mousedown', handleMouseDown);
    $canvas.addEventListener('mousemove', handleMouseMove);
    $canvas.addEventListener('mouseup', handleMouseUp);
    $canvas.addEventListener('wheel', handleWheel);

    const cleanup = () => {
        $canvas.removeEventListener('mousedown', handleMouseDown);
        $canvas.removeEventListener('mousemove', handleMouseMove);
        $canvas.removeEventListener('mouseup', handleMouseUp);
        $canvas.removeEventListener('wheel', handleWheel);
    };

    return cleanup;
}

function listenEvents(
    $canvas: HTMLCanvasElement,
    Mouse: MouseState,
    AbsolutePlane: AbsolutePlaneState,
    CANVAS_CONFIG: CanvasConfig,
    updatePlane: (plane: AbsolutePlaneState) => void,
) {
    const cleanupCanvas = listenCanvasEvents($canvas);
    const cleanupMouse = listenMouseEvents($canvas, Mouse, AbsolutePlane, CANVAS_CONFIG, updatePlane);

    // Combined cleanup function
    const cleanup = () => {
        cleanupCanvas();
        cleanupMouse();
    };

    return cleanup;
}

export {
    listenEvents,
}