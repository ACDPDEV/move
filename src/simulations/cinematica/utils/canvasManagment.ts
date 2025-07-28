// Variables para control de throttling y debouncing
let resizeTimeoutId: number | null = null;
let lastResizeTime = 0;
const RESIZE_THROTTLE = 16; // ~60fps
const RESIZE_DEBOUNCE = 100; // 100ms de espera después del último resize

function resizeCanvas($canvas: HTMLCanvasElement): void {
    // Obtener el contenedor padre
    const parent = $canvas.parentElement;
    if (!parent) {
        console.warn('Canvas no tiene elemento padre');
        return;
    }

    // Obtener las dimensiones disponibles del contenedor sin forzar reflow
    const availableWidth = parent.clientWidth;
    const availableHeight = parent.clientHeight;

    // Validar que tenemos dimensiones válidas
    if (availableWidth <= 0 || availableHeight <= 0) {
        return; // Salir silenciosamente si no hay dimensiones válidas
    }

    // Verificar si realmente necesitamos redimensionar
    const currentDisplayWidth = parseInt($canvas.style.width) || 0;
    const currentDisplayHeight = parseInt($canvas.style.height) || 0;

    if (
        currentDisplayWidth === availableWidth &&
        currentDisplayHeight === availableHeight
    ) {
        return; // No hay cambios, evitar redimensionamiento innecesario
    }

    // Obtener el device pixel ratio
    const ratio = window.devicePixelRatio || 1;
    const newInternalWidth = Math.floor(availableWidth * ratio);
    const newInternalHeight = Math.floor(availableHeight * ratio);

    // Verificar si las dimensiones internas también han cambiado
    if (
        $canvas.width === newInternalWidth &&
        $canvas.height === newInternalHeight
    ) {
        return; // Las dimensiones internas ya son correctas
    }

    // Guardar el estado del contexto antes de redimensionar
    const ctx = $canvas.getContext('2d');
    let imageData: ImageData | null = null;

    if (ctx && $canvas.width > 0 && $canvas.height > 0) {
        try {
            // Guardar el contenido actual del canvas
            imageData = ctx.getImageData(0, 0, $canvas.width, $canvas.height);
        } catch (e) {
            // Ignorar errores de seguridad si el canvas tiene contenido cross-origin
        }
    }

    // Redimensionar de una sola vez para evitar parpadeo
    $canvas.style.width = `${availableWidth}px`;
    $canvas.style.height = `${availableHeight}px`;
    $canvas.width = newInternalWidth;
    $canvas.height = newInternalHeight;

    // Reconfigurar el contexto
    if (ctx) {
        // Resetear y aplicar la escala
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.scale(ratio, ratio);

        // Restaurar el contenido si es posible (opcional)
        if (imageData) {
            try {
                // Esto podría causar distorsión, úsalo solo si es necesario
                // ctx.putImageData(imageData, 0, 0);
            } catch (e) {
                // Ignorar errores
            }
        }
    }
}

// Función con throttling para evitar múltiples calls
function throttledResizeCanvas(
    $canvas: HTMLCanvasElement,
    callback?: () => void,
): void {
    const now = Date.now();

    if (now - lastResizeTime < RESIZE_THROTTLE) {
        return; // Salir si estamos dentro del período de throttle
    }

    lastResizeTime = now;

    // Cancelar timeout anterior si existe
    if (resizeTimeoutId) {
        clearTimeout(resizeTimeoutId);
    }

    // Redimensionar inmediatamente
    resizeCanvas($canvas);

    // Programar callback con debounce
    resizeTimeoutId = window.setTimeout(() => {
        callback?.();
        resizeTimeoutId = null;
    }, RESIZE_DEBOUNCE);
}

// Función auxiliar optimizada con IntersectionObserver y ResizeObserver
function createCanvasResizeObserver(
    $canvas: HTMLCanvasElement,
    callback?: () => void,
): ResizeObserver {
    const resizeObserver = new ResizeObserver((entries) => {
        // Usar requestAnimationFrame para batch updates
        requestAnimationFrame(() => {
            throttledResizeCanvas($canvas, callback);
        });
    });

    // Observar el elemento padre del canvas
    const parent = $canvas.parentElement;
    if (parent) {
        resizeObserver.observe(parent);
    }

    return resizeObserver;
}

// Versión mejorada sin parpadeo
function initializeCanvas(
    $canvas: HTMLCanvasElement,
    callback?: () => void,
): () => void {
    // Hacer el canvas invisible durante la inicialización
    const originalVisibility = $canvas.style.visibility;
    $canvas.style.visibility = 'hidden';

    // Función para verificar si el canvas está listo
    const checkCanvasReady = (): Promise<void> => {
        return new Promise((resolve) => {
            const check = () => {
                const parent = $canvas.parentElement;
                if (
                    parent &&
                    parent.clientWidth > 0 &&
                    parent.clientHeight > 0
                ) {
                    resolve();
                } else {
                    // Usar requestIdleCallback si está disponible, sino requestAnimationFrame
                    if (window.requestIdleCallback) {
                        window.requestIdleCallback(check);
                    } else {
                        requestAnimationFrame(check);
                    }
                }
            };
            check();
        });
    };

    // Inicializar el canvas una vez que esté listo
    checkCanvasReady().then(() => {
        // Redimensionar
        resizeCanvas($canvas);

        // Hacer visible el canvas después de la inicialización
        $canvas.style.visibility = originalVisibility;

        // Ejecutar callback
        callback?.();
    });

    // Crear el ResizeObserver para cambios futuros
    const resizeObserver = createCanvasResizeObserver($canvas, callback);

    // Window resize como respaldo (con throttling)
    const handleWindowResize = () => {
        throttledResizeCanvas($canvas, callback);
    };

    window.addEventListener('resize', handleWindowResize, { passive: true });

    // Función de cleanup
    return () => {
        resizeObserver.disconnect();
        window.removeEventListener('resize', handleWindowResize);

        // Limpiar timeouts pendientes
        if (resizeTimeoutId) {
            clearTimeout(resizeTimeoutId);
            resizeTimeoutId = null;
        }
    };
}

// Función adicional para casos donde necesites forzar un resize inmediato
function forceCanvasResize(
    $canvas: HTMLCanvasElement,
    callback?: () => void,
): void {
    // Cancelar cualquier resize programado
    if (resizeTimeoutId) {
        clearTimeout(resizeTimeoutId);
        resizeTimeoutId = null;
    }

    // Resetear el tiempo de throttle
    lastResizeTime = 0;

    // Redimensionar inmediatamente
    resizeCanvas($canvas);
    callback?.();
}

export {
    resizeCanvas,
    createCanvasResizeObserver,
    initializeCanvas,
    forceCanvasResize,
    throttledResizeCanvas,
};
