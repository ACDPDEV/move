'use client';

import { initializeCanvas } from '@/simulations/cinematica/utils/canvasManagment';
import { usePlaneStore } from '../stores/usePlaneStore';
import { useMouseStore } from '../stores/useMouseStore';

function listenTouchEvents($canvas: HTMLCanvasElement) {
    let startPlanePosition = usePlaneStore.getState().position;

    const handleTouchStart = (event: TouchEvent) => {
        const MouseStore = useMouseStore.getState();
        const position = {
            x: event.touches[0].clientX,
            y: event.touches[0].clientY,
        };
        MouseStore.setIsDown(true);
        MouseStore.setStartPosition(position);
        MouseStore.setCurrentPosition(position);
        MouseStore.setDeltaPosition({ x: 0, y: 0 });
        startPlanePosition = usePlaneStore.getState().position;
    };
    const handleTouchMove = (event: TouchEvent) => {
        const MouseStore = useMouseStore.getState();
        const position = {
            x: event.touches[0].clientX,
            y: event.touches[0].clientY,
        };
        const MouseMoveIntensity =
            usePlaneStore.getState().moveSensitivity /
            usePlaneStore.getState().scale;
        MouseStore.setCurrentPosition(position);
        if (MouseStore.isDown) {
            MouseStore.setDeltaPosition({
                x: position.x - MouseStore.startPosition.x,
                y: position.y - MouseStore.startPosition.y,
            });
            usePlaneStore.getState().setPosition({
                x:
                    startPlanePosition.x +
                    MouseStore.deltaPosition.x * MouseMoveIntensity,
                y:
                    startPlanePosition.y -
                    MouseStore.deltaPosition.y * MouseMoveIntensity,
            });
        }
    };
    const handleTouchEnd = (event: TouchEvent) => {
        const MouseStore = useMouseStore.getState();
        MouseStore.setIsDown(false);
        MouseStore.setDeltaPosition({ x: 0, y: 0 });
        MouseStore.setStartPosition({ x: 0, y: 0 });
        startPlanePosition = usePlaneStore.getState().position;
    };
    const handleTouchCancel = (event: TouchEvent) => {
        const MouseStore = useMouseStore.getState();
        MouseStore.setIsDown(false);
        MouseStore.setDeltaPosition({ x: 0, y: 0 });
        MouseStore.setStartPosition({ x: 0, y: 0 });
        startPlanePosition = usePlaneStore.getState().position;
    };
    $canvas.addEventListener('touchstart', handleTouchStart);
    $canvas.addEventListener('touchmove', handleTouchMove);
    $canvas.addEventListener('touchend', handleTouchEnd);
    $canvas.addEventListener('touchcancel', handleTouchCancel);
    // Cleanup
    return () => {
        $canvas.removeEventListener('touchstart', handleTouchStart);
        $canvas.removeEventListener('touchmove', handleTouchMove);
        $canvas.removeEventListener('touchend', handleTouchEnd);
        $canvas.removeEventListener('touchcancel', handleTouchCancel);
    };
}

function listenMouseEvents($canvas: HTMLCanvasElement) {
    let startPlanePosition = usePlaneStore.getState().position;

    const handleMouseDown = (event: MouseEvent) => {
        $canvas.style.cursor = 'grabbing';
        const MouseStore = useMouseStore.getState();
        const position = { x: event.offsetX, y: event.offsetY };
        MouseStore.setIsDown(true);
        MouseStore.setStartPosition(position);
        MouseStore.setCurrentPosition(position);
        MouseStore.setDeltaPosition({ x: 0, y: 0 });
        startPlanePosition = usePlaneStore.getState().position;
    };
    const handleMouseMove = (event: MouseEvent) => {
        const MouseStore = useMouseStore.getState();
        const position = { x: event.offsetX, y: event.offsetY };
        const MouseMoveIntensity =
            usePlaneStore.getState().moveSensitivity /
            usePlaneStore.getState().scale;
        MouseStore.setCurrentPosition(position);
        if (MouseStore.isDown) {
            MouseStore.setDeltaPosition({
                x: position.x - MouseStore.startPosition.x,
                y: position.y - MouseStore.startPosition.y,
            });
            usePlaneStore.getState().setPosition({
                x:
                    startPlanePosition.x +
                    MouseStore.deltaPosition.x * MouseMoveIntensity,
                y:
                    startPlanePosition.y -
                    MouseStore.deltaPosition.y * MouseMoveIntensity,
            });
        }
    };
    const handleMouseUp = (event: MouseEvent) => {
        $canvas.style.cursor = 'default';
        const MouseStore = useMouseStore.getState();
        MouseStore.setIsDown(false);
        MouseStore.setDeltaPosition({ x: 0, y: 0 });
        MouseStore.setStartPosition({ x: 0, y: 0 });
        startPlanePosition = usePlaneStore.getState().position;
    };
    const handleMouseWheel = (event: WheelEvent) => {
        const { width, height } = $canvas.getBoundingClientRect();
        event.preventDefault();
        const PlaneStore = usePlaneStore.getState();
        const MouseStore = useMouseStore.getState();

        const zoomIntensity = PlaneStore.zoomSensitivity;
        const wheelDir = event.deltaY < 0 ? 1 : -1;
        const zoom = Math.exp(wheelDir * zoomIntensity);
        const newScale = Math.max(
            PlaneStore.minScale,
            Math.min(PlaneStore.maxScale, PlaneStore.scale * zoom),
        );
        PlaneStore.setScale(newScale);
        PlaneStore.setPosition({
            x:
                usePlaneStore.getState().position.x +
                (width / newScale - width / PlaneStore.scale) *
                    (MouseStore.currentPosition.x / width),
            y:
                usePlaneStore.getState().position.y -
                (height / newScale - height / PlaneStore.scale) *
                    (MouseStore.currentPosition.y / height),
        });
    };

    $canvas.addEventListener('mousedown', handleMouseDown);
    $canvas.addEventListener('mousemove', handleMouseMove);
    $canvas.addEventListener('mouseup', handleMouseUp);
    $canvas.addEventListener('wheel', handleMouseWheel);

    // Cleanup
    return () => {
        $canvas.removeEventListener('mousedown', handleMouseDown);
        $canvas.removeEventListener('mousemove', handleMouseMove);
        $canvas.removeEventListener('mouseup', handleMouseUp);
        $canvas.removeEventListener('wheel', handleMouseWheel);
    };
}

/**
 * Inicializa canvas y añade listeners de interacción.
 */
function listenEvents($canvas: HTMLCanvasElement) {
    const cleanupCanvas = initializeCanvas($canvas, () => {
        /* Aquí podrías marcar que el frame necesita redibujar */
    });

    const cleanupTouch = listenTouchEvents($canvas);
    const cleanupMouse = listenMouseEvents($canvas);

    // Función única de limpieza
    return () => {
        cleanupCanvas();
        cleanupTouch();
        cleanupMouse();
    };
}

export { listenEvents };
