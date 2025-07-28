import { initializeCanvas } from '@/simulations/cinematica/utils/canvasManagment';
import { usePlaneStore } from '../store/usePlaneStore';
import { useMouseStore } from '../store/useMouseStore';

function listenCanvasEvents($canvas: HTMLCanvasElement) {
    // Callback optimizado que evita llamadas innecesarias
    let isUpdating = false;

    const updateCallback = () => {
        if (isUpdating) return; // Evitar llamadas múltiples

        isUpdating = true;
    };

    // Usar la nueva función de inicialización mejorada
    const cleanup = initializeCanvas($canvas, updateCallback);

    return cleanup;
}

function listenMouseEvents($canvas: HTMLCanvasElement) {
    // Callbacks
    const handleMouseDown = (event: MouseEvent) => {
        const MouseStore = useMouseStore.getState();
        const position = { x: event.offsetX, y: event.offsetY };

        MouseStore.setIsDown(true);
        MouseStore.setStartPosition(position);
        MouseStore.setCurrentPosition(position);
        MouseStore.setDeltaPosition({ x: 0, y: 0 });
    };

    const handleMouseMove = (event: MouseEvent) => {
        const MouseStore = useMouseStore.getState();
        const newPosition = { x: event.offsetX, y: event.offsetY };

        // Siempre actualizar la posición actual del mouse
        const oldPosition = MouseStore.currentPosition;
        MouseStore.setCurrentPosition(newPosition);

        // Solo procesar el arrastre si el mouse está presionado
        if (MouseStore.isDown) {
            const PlaneStore = usePlaneStore.getState();

            // Calcular el delta basado en la posición anterior
            const deltaX = newPosition.x - oldPosition.x;
            const deltaY = newPosition.y - oldPosition.y;

            const deltaPosition = { x: deltaX, y: deltaY };

            // Actualizar el delta en el store
            MouseStore.setDeltaPosition(deltaPosition);

            // Actualizar la posición del plano
            PlaneStore.setPosition({
                x: PlaneStore.position.x + deltaX * PlaneStore.moveSensitivity,
                y: PlaneStore.position.y - deltaY * PlaneStore.moveSensitivity,
            });
        }
    };

    const handleMouseUp = () => {
        const MouseStore = useMouseStore.getState();
        MouseStore.setIsDown(false);
        MouseStore.setDeltaPosition({ x: 0, y: 0 });
    };

    // Manejar cuando el mouse sale del canvas
    const handleMouseLeave = () => {
        const MouseStore = useMouseStore.getState();
        if (MouseStore.isDown) {
            MouseStore.setIsDown(false);
            MouseStore.setDeltaPosition({ x: 0, y: 0 });
        }
    };

    const handleWheel = (event: WheelEvent) => {
        event.preventDefault();
        const PlaneStore = usePlaneStore.getState();

        const zoomIntensity = PlaneStore.zoomSensitivity;
        const wheel = event.deltaY < 0 ? 1 : -1;
        const zoom = Math.exp(wheel * zoomIntensity);

        const newScale = Math.max(
            PlaneStore.minScale,
            Math.min(PlaneStore.maxScale, PlaneStore.scale * zoom),
        );

        PlaneStore.setScale(newScale);
    };

    // Event listeners
    $canvas.addEventListener('mousedown', handleMouseDown);
    $canvas.addEventListener('mousemove', handleMouseMove);
    $canvas.addEventListener('mouseup', handleMouseUp);
    $canvas.addEventListener('mouseleave', handleMouseLeave);
    $canvas.addEventListener('wheel', handleWheel, { passive: false });

    const cleanup = () => {
        $canvas.removeEventListener('mousedown', handleMouseDown);
        $canvas.removeEventListener('mousemove', handleMouseMove);
        $canvas.removeEventListener('mouseup', handleMouseUp);
        $canvas.removeEventListener('mouseleave', handleMouseLeave);
        $canvas.removeEventListener('wheel', handleWheel);
    };

    return cleanup;
}

function listenEvents($canvas: HTMLCanvasElement) {
    const cleanupCanvas = listenCanvasEvents($canvas);
    const cleanupMouse = listenMouseEvents($canvas);

    // Combined cleanup function
    const cleanup = () => {
        cleanupCanvas();
        cleanupMouse();
    };

    return cleanup;
}

export { listenEvents };
