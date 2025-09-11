'use client';

import { initializeCanvas } from '@/simulations/cinematica/utils/canvasManagment';
import { usePlaneStore } from '../stores/usePlaneStore';
import { useMouseStore } from '../stores/useMouseStore';

/**
 * Añade soporte de eventos táctiles y de mouse (incluyendo gestos de pellizco) al canvas.
 */
function listenPointerEvents($canvas: HTMLCanvasElement) {
    // Estado para múltiples punteros (touch/mouse)
    const pointers = new Map<number, PointerEvent>();
    let initialPinchDistance = 0;

    // ----- Callbacks -----

    const handlePointerDown = (e: PointerEvent) => {
        // Capturar puntero para recibir eventos fuera del canvas
        $canvas.setPointerCapture(e.pointerId);
        pointers.set(e.pointerId, e);

        const position = { x: e.offsetX, y: e.offsetY };
        const MouseStore = useMouseStore.getState();

        if (pointers.size === 1) {
            // Iniciar arrastre con un solo puntero
            MouseStore.setIsDown(true);
            MouseStore.setStartPosition(position);
            MouseStore.setCurrentPosition(position);
            MouseStore.setDeltaPosition({ x: 0, y: 0 });
        } else if (pointers.size === 2) {
            // Preparar pellizco: calcular distancia inicial
            const [p1, p2] = Array.from(pointers.values());
            initialPinchDistance = Math.hypot(
                p2.clientX - p1.clientX,
                p2.clientY - p1.clientY,
            );
        }
    };

    const handlePointerMove = (e: PointerEvent) => {
        if (!pointers.has(e.pointerId)) return;
        pointers.set(e.pointerId, e);

        const MouseStore = useMouseStore.getState();
        const PlaneStore = usePlaneStore.getState();

        const newPos = { x: e.offsetX, y: e.offsetY };
        if (pointers.size === 1 && MouseStore.isDown) {
            // Lógica de arrastre
            MouseStore.setCurrentPosition(newPos);
            const oldPos = MouseStore.currentPosition;

            const moveIntensity = PlaneStore.moveSensitivity / PlaneStore.scale;
            const deltaX = newPos.x - oldPos.x;
            const deltaY = newPos.y - oldPos.y;

            MouseStore.setDeltaPosition({ x: deltaX, y: deltaY });
            PlaneStore.setPosition({
                x: PlaneStore.position.x + deltaX * moveIntensity,
                y: PlaneStore.position.y - deltaY * moveIntensity,
            });
        } else if (pointers.size === 2) {
            // Lógica de zoom por pellizco
            const [p1, p2] = Array.from(pointers.values());
            const currentDistance = Math.hypot(
                p2.clientX - p1.clientX,
                p2.clientY - p1.clientY,
            );

            if (initialPinchDistance > 0) {
                const zoomFactor = currentDistance / initialPinchDistance;
                const newScale = Math.max(
                    PlaneStore.minScale,
                    Math.min(
                        PlaneStore.maxScale,
                        PlaneStore.scale * zoomFactor,
                    ),
                );
                PlaneStore.setScale(newScale);
                initialPinchDistance = currentDistance;
            }
        }
    };

    const handlePointerUp = (e: PointerEvent) => {
        if (pointers.delete(e.pointerId)) {
            $canvas.releasePointerCapture(e.pointerId);
        }

        const MouseStore = useMouseStore.getState();
        if (pointers.size === 0 && MouseStore.isDown) {
            MouseStore.setIsDown(false);
            MouseStore.setDeltaPosition({ x: 0, y: 0 });
            MouseStore.setStartPosition({ x: 0, y: 0 });
        }
        if (pointers.size < 2) {
            initialPinchDistance = 0;
        }
    };

    const handleWheel = (event: WheelEvent) => {
        event.preventDefault();
        const PlaneStore = usePlaneStore.getState();

        const zoomIntensity = PlaneStore.zoomSensitivity;
        const wheelDir = event.deltaY < 0 ? 1 : -1;
        const zoom = Math.exp(wheelDir * zoomIntensity);
        const newScale = Math.max(
            PlaneStore.minScale,
            Math.min(PlaneStore.maxScale, PlaneStore.scale * zoom),
        );

        PlaneStore.setScale(newScale);
    };

    const handleMouseMove = (e: MouseEvent) => {
        const MouseStore = useMouseStore.getState();
        const position = { x: e.offsetX, y: e.offsetY };
        MouseStore.setCurrentPosition(position);
    };

    // ----- Añadir listeners -----
    $canvas.addEventListener('pointerdown', handlePointerDown);
    $canvas.addEventListener('pointermove', handlePointerMove);
    $canvas.addEventListener('pointerup', handlePointerUp);
    $canvas.addEventListener('pointercancel', handlePointerUp);
    $canvas.addEventListener('wheel', handleWheel, { passive: false });
    $canvas.addEventListener('mousemove', handleMouseMove);

    // Cleanup
    return () => {
        $canvas.removeEventListener('pointerdown', handlePointerDown);
        $canvas.removeEventListener('pointermove', handlePointerMove);
        $canvas.removeEventListener('pointerup', handlePointerUp);
        $canvas.removeEventListener('pointercancel', handlePointerUp);
        $canvas.removeEventListener('wheel', handleWheel);
        $canvas.removeEventListener('mousemove', handleMouseMove);
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

    // const cleanupPointer = listenPointerEvents($canvas);
    const cleanupMouse = listenMouseEvents($canvas);

    // Función única de limpieza
    return () => {
        cleanupCanvas();
        // cleanupPointer();
        cleanupMouse();
    };
}

export { listenEvents };
