'use client';

import { initializeCanvas } from '@/simulations/cinematica/utils/canvasManagment';
import { usePlaneStore } from '@/simulations/cinematica/stores/usePlaneStore';
import { useMouseStore } from '@/simulations/cinematica/stores/useMouseStore';

function getDistance(touch1: Touch, touch2: Touch): number {
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
}

function getCenter(touch1: Touch, touch2: Touch): { x: number; y: number } {
    return {
        x: (touch1.clientX + touch2.clientX) / 2,
        y: (touch1.clientY + touch2.clientY) / 2,
    };
}

function listenTouchEvents($canvas: HTMLCanvasElement) {
    let startPlanePosition = usePlaneStore.getState().position;
    let initialDistance = 0;
    let initialScale = 1;
    let lastCenter = { x: 0, y: 0 };

    const handleTouchStart = (event: TouchEvent) => {
        event.preventDefault();
        const MouseStore = useMouseStore.getState();

        if (event.touches.length === 1) {
            const position = {
                x: event.touches[0].clientX,
                y: event.touches[0].clientY,
            };
            MouseStore.setIsDown(true);
            MouseStore.setStartPosition(position);
            MouseStore.setCurrentPosition(position);
            MouseStore.setDeltaPosition({ x: 0, y: 0 });
            startPlanePosition = usePlaneStore.getState().position;
        } else if (event.touches.length === 2) {
            MouseStore.setIsDown(false);
            initialDistance = getDistance(event.touches[0], event.touches[1]);
            initialScale = usePlaneStore.getState().scale;
            lastCenter = getCenter(event.touches[0], event.touches[1]);
            startPlanePosition = usePlaneStore.getState().position;
        }
    };

    const handleTouchMove = (event: TouchEvent) => {
        event.preventDefault();
        const MouseStore = useMouseStore.getState();
        const PlaneStore = usePlaneStore.getState();

        if (event.touches.length === 1 && MouseStore.isDown) {
            const position = {
                x: event.touches[0].clientX,
                y: event.touches[0].clientY,
            };
            const MouseMoveIntensity =
                PlaneStore.moveSensitivity / PlaneStore.scale;

            MouseStore.setCurrentPosition(position);
            MouseStore.setDeltaPosition({
                x: position.x - MouseStore.startPosition.x,
                y: position.y - MouseStore.startPosition.y,
            });

            PlaneStore.setPosition({
                x:
                    startPlanePosition.x +
                    MouseStore.deltaPosition.x * MouseMoveIntensity,
                y:
                    startPlanePosition.y -
                    MouseStore.deltaPosition.y * MouseMoveIntensity,
            });
        } else if (event.touches.length === 2) {
            const currentDistance = getDistance(
                event.touches[0],
                event.touches[1],
            );
            const currentCenter = getCenter(event.touches[0], event.touches[1]);

            const zoomFactor = currentDistance / initialDistance;
            const newScale = Math.max(
                PlaneStore.minScale,
                Math.min(PlaneStore.maxScale, initialScale * zoomFactor),
            );

            const rect = $canvas.getBoundingClientRect();

            const zoomCenterX = (currentCenter.x - rect.left) / rect.width;
            const zoomCenterY = (currentCenter.y - rect.top) / rect.height;

            PlaneStore.setScale(newScale);
            PlaneStore.setPosition({
                x:
                    startPlanePosition.x +
                    (rect.width / newScale - rect.width / initialScale) *
                        zoomCenterX,
                y:
                    startPlanePosition.y -
                    (rect.height / newScale - rect.height / initialScale) *
                        zoomCenterY,
            });

            lastCenter = currentCenter;
        }
    };

    const handleTouchEnd = (event: TouchEvent) => {
        const MouseStore = useMouseStore.getState();

        if (event.touches.length === 0) {
            MouseStore.setIsDown(false);
            MouseStore.setDeltaPosition({ x: 0, y: 0 });
            MouseStore.setStartPosition({ x: 0, y: 0 });
            startPlanePosition = usePlaneStore.getState().position;
            initialDistance = 0;
        } else if (event.touches.length === 1) {
            const position = {
                x: event.touches[0].clientX,
                y: event.touches[0].clientY,
            };
            MouseStore.setIsDown(true);
            MouseStore.setStartPosition(position);
            MouseStore.setCurrentPosition(position);
            MouseStore.setDeltaPosition({ x: 0, y: 0 });
            startPlanePosition = usePlaneStore.getState().position;
            initialDistance = 0;
        }
    };

    const handleTouchCancel = (event: TouchEvent) => {
        const MouseStore = useMouseStore.getState();
        MouseStore.setIsDown(false);
        MouseStore.setDeltaPosition({ x: 0, y: 0 });
        MouseStore.setStartPosition({ x: 0, y: 0 });
        startPlanePosition = usePlaneStore.getState().position;
        initialDistance = 0;
    };

    $canvas.addEventListener('touchstart', handleTouchStart, {
        passive: false,
    });
    $canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
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
