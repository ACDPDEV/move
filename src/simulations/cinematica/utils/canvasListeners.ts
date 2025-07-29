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

        if (pointers.size === 1 && MouseStore.isDown) {
            // Lógica de arrastre
            const newPos = { x: e.offsetX, y: e.offsetY };
            const oldPos = MouseStore.currentPosition;
            MouseStore.setCurrentPosition(newPos);

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
        }
        if (pointers.size < 2) {
            initialPinchDistance = 0;
        }
    };

    const handleWheel = (event: WheelEvent) => {
        event.preventDefault();
        const PlaneStore = usePlaneStore.getState();

        const zoomIntensity = PlaneStore.zoomSensitivity * PlaneStore.scale;
        const wheelDir = event.deltaY < 0 ? 1 : -1;
        const zoom = Math.exp(wheelDir * zoomIntensity);
        const newScale = Math.max(
            PlaneStore.minScale,
            Math.min(PlaneStore.maxScale, PlaneStore.scale * zoom),
        );

        PlaneStore.setScale(newScale);
    };

    // ----- Añadir listeners -----
    $canvas.addEventListener('pointerdown', handlePointerDown);
    $canvas.addEventListener('pointermove', handlePointerMove);
    $canvas.addEventListener('pointerup', handlePointerUp);
    $canvas.addEventListener('pointercancel', handlePointerUp);
    $canvas.addEventListener('wheel', handleWheel, { passive: false });

    // Cleanup
    return () => {
        $canvas.removeEventListener('pointerdown', handlePointerDown);
        $canvas.removeEventListener('pointermove', handlePointerMove);
        $canvas.removeEventListener('pointerup', handlePointerUp);
        $canvas.removeEventListener('pointercancel', handlePointerUp);
        $canvas.removeEventListener('wheel', handleWheel);
    };
}

/**
 * Inicializa canvas y añade listeners de interacción.
 */
function listenEvents($canvas: HTMLCanvasElement) {
    const cleanupCanvas = initializeCanvas($canvas, () => {
        /* Aquí podrías marcar que el frame necesita redibujar */
    });

    const cleanupPointer = listenPointerEvents($canvas);

    // Función única de limpieza
    return () => {
        cleanupCanvas();
        cleanupPointer();
    };
}

export { listenEvents };
