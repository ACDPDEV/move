'use client';

import { initializeCanvas } from '@/simulations/cinematica/utils/canvasManagment';
import { usePlaneStore } from '../stores/usePlaneStore';
import { useMouseStore } from '../stores/useMouseStore';

/**
 * Añade soporte de eventos táctiles y de mouse optimizado para mobile
 */
function listenPointerEvents($canvas: HTMLCanvasElement) {
    // Estado para múltiples punteros (touch/mouse)
    const pointers = new Map<number, PointerEvent>();
    let initialPinchDistance = 0;
    let lastPinchCenter = { x: 0, y: 0 };

    // Variables para optimización de rendimiento
    let animationFrameId: number | null = null;
    let pendingUpdate = false;
    let lastUpdateTime = 0;
    const UPDATE_THROTTLE = 16; // ~60fps máximo

    // Detección de dispositivo móvil
    const isMobile =
        /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
            navigator.userAgent,
        ) ||
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0;

    // Ajustar sensibilidades para móvil
    const getMoveSensitivity = () => {
        const PlaneStore = usePlaneStore.getState();
        return isMobile
            ? PlaneStore.moveSensitivity * 1.5
            : PlaneStore.moveSensitivity;
    };

    const getZoomSensitivity = () => {
        const PlaneStore = usePlaneStore.getState();
        return isMobile
            ? PlaneStore.zoomSensitivity * 0.8
            : PlaneStore.zoomSensitivity;
    };

    // Función para actualizar el store de forma throttled
    const scheduleUpdate = (updateFn: () => void) => {
        if (pendingUpdate) return;

        const now = performance.now();
        if (now - lastUpdateTime < UPDATE_THROTTLE) {
            pendingUpdate = true;
            animationFrameId = requestAnimationFrame(() => {
                updateFn();
                pendingUpdate = false;
                lastUpdateTime = performance.now();
                animationFrameId = null;
            });
        } else {
            updateFn();
            lastUpdateTime = now;
        }
    };

    // Calcular centro entre dos puntos
    const getPinchCenter = (p1: PointerEvent, p2: PointerEvent) => ({
        x: (p1.clientX + p2.clientX) / 2,
        y: (p1.clientY + p2.clientY) / 2,
    });

    // Convertir coordenadas del cliente a coordenadas del canvas
    const getCanvasCoordinates = (clientX: number, clientY: number) => {
        const rect = $canvas.getBoundingClientRect();
        return {
            x: (clientX - rect.left) * ($canvas.width / rect.width),
            y: (clientY - rect.top) * ($canvas.height / rect.height),
        };
    };

    // ----- Callbacks -----

    const handlePointerDown = (e: PointerEvent) => {
        e.preventDefault();
        document.body.style.cursor = 'grabbing';

        // Capturar puntero para recibir eventos fuera del canvas
        $canvas.setPointerCapture(e.pointerId);
        pointers.set(e.pointerId, e);

        const coords = getCanvasCoordinates(e.clientX, e.clientY);
        const MouseStore = useMouseStore.getState();

        if (pointers.size === 1) {
            // Iniciar arrastre con un solo puntero
            MouseStore.setIsDown(true);
            MouseStore.setStartPosition(coords);
            MouseStore.setCurrentPosition(coords);
            MouseStore.setDeltaPosition({ x: 0, y: 0 });
        } else if (pointers.size === 2) {
            // Preparar pellizco: calcular distancia inicial
            const [p1, p2] = Array.from(pointers.values());
            initialPinchDistance = Math.hypot(
                p2.clientX - p1.clientX,
                p2.clientY - p1.clientY,
            );
            lastPinchCenter = getPinchCenter(p1, p2);

            // Detener el arrastre cuando inicia el pellizco
            MouseStore.setIsDown(false);
        }
    };

    const handlePointerMove = (e: PointerEvent) => {
        if (!pointers.has(e.pointerId)) return;

        e.preventDefault();
        pointers.set(e.pointerId, e);

        const MouseStore = useMouseStore.getState();
        const PlaneStore = usePlaneStore.getState();

        if (pointers.size === 1 && MouseStore.isDown) {
            // Lógica de arrastre optimizada
            const coords = getCanvasCoordinates(e.clientX, e.clientY);
            const oldPos = MouseStore.currentPosition;

            scheduleUpdate(() => {
                MouseStore.setCurrentPosition(coords);

                const moveIntensity = getMoveSensitivity() / PlaneStore.scale;
                const deltaX = coords.x - oldPos.x;
                const deltaY = coords.y - oldPos.y;

                MouseStore.setDeltaPosition({ x: deltaX, y: deltaY });
                PlaneStore.setPosition({
                    x: PlaneStore.position.x + deltaX * moveIntensity,
                    y: PlaneStore.position.y - deltaY * moveIntensity,
                });
            });
        } else if (pointers.size === 2) {
            // Lógica de zoom por pellizco optimizada
            const [p1, p2] = Array.from(pointers.values());
            const currentDistance = Math.hypot(
                p2.clientX - p1.clientX,
                p2.clientY - p1.clientY,
            );

            const currentCenter = getPinchCenter(p1, p2);

            if (initialPinchDistance > 0) {
                scheduleUpdate(() => {
                    // Calcular zoom
                    const zoomFactor = currentDistance / initialPinchDistance;
                    const adjustedZoomFactor =
                        1 + (zoomFactor - 1) * getZoomSensitivity() * 10;

                    const newScale = Math.max(
                        PlaneStore.minScale,
                        Math.min(
                            PlaneStore.maxScale,
                            PlaneStore.scale * adjustedZoomFactor,
                        ),
                    );

                    // Zoom hacia el centro del pellizco
                    const canvasCenter = getCanvasCoordinates(
                        currentCenter.x,
                        currentCenter.y,
                    );
                    const worldCenter = {
                        x:
                            PlaneStore.position.x +
                            (canvasCenter.x - $canvas.width / 2) /
                                PlaneStore.scale,
                        y:
                            PlaneStore.position.y -
                            (canvasCenter.y - $canvas.height / 2) /
                                PlaneStore.scale,
                    };

                    PlaneStore.setScale(newScale);

                    // Ajustar posición para mantener el punto de zoom fijo
                    const newWorldCenter = {
                        x:
                            PlaneStore.position.x +
                            (canvasCenter.x - $canvas.width / 2) / newScale,
                        y:
                            PlaneStore.position.y -
                            (canvasCenter.y - $canvas.height / 2) / newScale,
                    };

                    PlaneStore.setPosition({
                        x:
                            PlaneStore.position.x -
                            (newWorldCenter.x - worldCenter.x),
                        y:
                            PlaneStore.position.y -
                            (newWorldCenter.y - worldCenter.y),
                    });
                });

                initialPinchDistance = currentDistance;
                lastPinchCenter = currentCenter;
            }
        }
    };

    const handlePointerUp = (e: PointerEvent) => {
        e.preventDefault();
        document.body.style.cursor = 'default';

        if (pointers.delete(e.pointerId)) {
            $canvas.releasePointerCapture(e.pointerId);
        }

        const MouseStore = useMouseStore.getState();

        if (pointers.size === 0) {
            MouseStore.setIsDown(false);
            MouseStore.setDeltaPosition({ x: 0, y: 0 });
            initialPinchDistance = 0;
        } else if (pointers.size === 1) {
            // Si queda un puntero, reiniciar el arrastre
            const remainingPointer = Array.from(pointers.values())[0];
            const coords = getCanvasCoordinates(
                remainingPointer.clientX,
                remainingPointer.clientY,
            );
            MouseStore.setIsDown(true);
            MouseStore.setStartPosition(coords);
            MouseStore.setCurrentPosition(coords);
            initialPinchDistance = 0;
        }

        if (pointers.size < 2) {
            initialPinchDistance = 0;
        }
    };

    const handleWheel = (event: WheelEvent) => {
        event.preventDefault();

        scheduleUpdate(() => {
            const PlaneStore = usePlaneStore.getState();
            const zoomIntensity = getZoomSensitivity();
            const wheelDir = event.deltaY < 0 ? 1 : -1;
            const zoom = Math.exp(wheelDir * zoomIntensity);
            const newScale = Math.max(
                PlaneStore.minScale,
                Math.min(PlaneStore.maxScale, PlaneStore.scale * zoom),
            );

            PlaneStore.setScale(newScale);
        });
    };

    // Prevenir comportamientos por defecto en mobile
    const preventDefaultTouch = (e: TouchEvent) => {
        if (e.touches.length > 1) {
            e.preventDefault();
        }
    };

    // ----- Añadir listeners -----
    $canvas.addEventListener('pointerdown', handlePointerDown);
    $canvas.addEventListener('pointermove', handlePointerMove);
    $canvas.addEventListener('pointerup', handlePointerUp);
    $canvas.addEventListener('pointercancel', handlePointerUp);
    $canvas.addEventListener('wheel', handleWheel, { passive: false });

    // Listeners específicos para mobile
    if (isMobile) {
        $canvas.addEventListener('touchstart', preventDefaultTouch, {
            passive: false,
        });
        $canvas.addEventListener('touchmove', preventDefaultTouch, {
            passive: false,
        });

        // Prevenir zoom del navegador
        document.addEventListener('gesturestart', (e) => e.preventDefault());
        document.addEventListener('gesturechange', (e) => e.preventDefault());
    }

    // Cleanup
    return () => {
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
        }

        $canvas.removeEventListener('pointerdown', handlePointerDown);
        $canvas.removeEventListener('pointermove', handlePointerMove);
        $canvas.removeEventListener('pointerup', handlePointerUp);
        $canvas.removeEventListener('pointercancel', handlePointerUp);
        $canvas.removeEventListener('wheel', handleWheel);

        if (isMobile) {
            $canvas.removeEventListener('touchstart', preventDefaultTouch);
            $canvas.removeEventListener('touchmove', preventDefaultTouch);
            document.removeEventListener('gesturestart', (e) =>
                e.preventDefault(),
            );
            document.removeEventListener('gesturechange', (e) =>
                e.preventDefault(),
            );
        }
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
