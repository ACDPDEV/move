import { useEffect, useCallback, useRef } from 'preact/hooks';
import { Application } from 'pixi.js';
import type { RefObject } from 'preact';

/**
 * Configuración del hook usePixiApp
 */
interface UsePixiAppConfig<T> {
    setup: (app: Application, canvas: HTMLCanvasElement, container: HTMLElement) => Promise<void>;
    preload: () => Promise<void>;
    loop: (app: Application, entities: [T[], (entities: T[]) => void], deltaTime?: number) => void;
    cleanup?: (app: Application, entities: T[]) => void;
    canvasRef: RefObject<HTMLCanvasElement>;
    containerRef: RefObject<HTMLElement>;
    entities: T[];
    updateEntities: (entities: T[]) => void;
    isPlaying: boolean;
    speed: number;
    onTimeUpdate?: (time: number) => void;
    onFPSUpdate?: (fps: number) => void;
}

/**
 * Resultado del hook usePixiApp
 */
interface UsePixiAppResult {
    appRef: RefObject<Application | null>;
    isReady: RefObject<boolean>;
    timeRef: RefObject<number>;
    restart: () => void;
    step: () => void;
}

/**
 * Hook personalizado para manejar el ciclo de vida de una aplicación PixiJS
 * Incluye inicialización, bucle de animación, gestión de tiempo y limpieza
 * 
 * @param config - Configuración del hook
 * @returns Objeto con referencias y métodos para controlar la aplicación
 */
export function usePixiApp<T = any>(config: UsePixiAppConfig<T>): UsePixiAppResult {
    const {
        setup,
        preload,
        loop,
        cleanup,
        canvasRef,
        containerRef,
        entities,
        updateEntities,
        isPlaying,
        speed,
        onTimeUpdate,
        onFPSUpdate
    } = config;

    // Referencias del hook
    const appRef = useRef<Application | null>(null);
    const isReady = useRef<boolean>(false);
    const timeRef = useRef<number>(0);
    const animationRef = useRef<number | null>(null);
    const lastTimeRef = useRef<number>(0);

    /**
     * Inicializa la aplicación PixiJS
     */
    const initializeApp = useCallback(async () => {
        if (!canvasRef.current || !containerRef.current || appRef.current) {
            return;
        }

        try {
            console.log('Inicializando aplicación PixiJS...');
            
            // Crear nueva aplicación
            const app = new Application();
            appRef.current = app;

            // Precargar recursos
            await preload();

            // Configurar la aplicación
            await setup(app, canvasRef.current, containerRef.current);

            isReady.current = true;
            console.log('Aplicación PixiJS inicializada correctamente');
        } catch (error) {
            console.error('Error al inicializar PixiJS:', error);
            isReady.current = false;
        }
    }, [setup, preload, canvasRef, containerRef]);

    /**
     * Bucle de animación
     */
    const animate = useCallback((currentTime: number) => {
        if (!appRef.current || !isReady.current || !isPlaying) {
            return;
        }

        // Calcular delta time
        const deltaTime = currentTime - lastTimeRef.current;
        lastTimeRef.current = currentTime;

        // Actualizar tiempo interno
        timeRef.current += (deltaTime / 1000) * speed;

        // Calcular FPS
        const currentFPS = deltaTime > 0 ? 1000 / deltaTime : 0;

        // Notificar actualizaciones
        if (onTimeUpdate) {
            onTimeUpdate(timeRef.current);
        }
        if (onFPSUpdate) {
            onFPSUpdate(currentFPS);
        }

        // Ejecutar bucle de simulación
        loop(appRef.current, [entities, updateEntities], deltaTime * speed);

        // Continuar animación
        animationRef.current = requestAnimationFrame(animate);
    }, [isPlaying, speed, entities, updateEntities, loop, onTimeUpdate, onFPSUpdate]);

    /**
     * Inicia el bucle de animación
     */
    const startAnimation = useCallback(() => {
        if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
        }
        lastTimeRef.current = performance.now();
        animationRef.current = requestAnimationFrame(animate);
    }, [animate]);

    /**
     * Detiene el bucle de animación
     */
    const stopAnimation = useCallback(() => {
        if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
            animationRef.current = null;
        }
    }, []);

    /**
     * Reinicia la simulación
     */
    const restart = useCallback(() => {
        timeRef.current = 0;
        if (onTimeUpdate) {
            onTimeUpdate(0);
        }
        if (isPlaying) {
            startAnimation();
        }
    }, [isPlaying, startAnimation, onTimeUpdate]);

    /**
     * Ejecuta un paso único de la simulación
     */
    const step = useCallback(() => {
        if (!appRef.current || !isReady.current) return;

        const deltaTime = 16.67; // ~60 FPS
        timeRef.current += (deltaTime / 1000) * speed;
        
        if (onTimeUpdate) {
            onTimeUpdate(timeRef.current);
        }

        loop(appRef.current, [entities, updateEntities], deltaTime * speed);
    }, [speed, entities, updateEntities, loop, onTimeUpdate]);

    // Efecto de inicialización
    useEffect(() => {
        let isMounted = true;
        
        const init = async () => {
            await initializeApp();
            if (isMounted && isPlaying) {
                startAnimation();
            }
        };
        
        init();

        return () => {
            isMounted = false;
            
            // Cleanup al desmontar
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
                animationRef.current = null;
            }
            
            if (appRef.current) {
                try {
                    // Limpiar recursos de la aplicación
                    if (cleanup) {
                        cleanup(appRef.current, entities);
                    }
                    
                    // Detener y destruir la aplicación
                    appRef.current.stop();
                    appRef.current.destroy(true, { 
                        children: true, 
                        texture: true,
                        context: true
                    });
                    
                    // Limpiar referencias
                    if (appRef.current.canvas && appRef.current.canvas.parentNode) {
                        appRef.current.canvas.parentNode.removeChild(appRef.current.canvas);
                    }
                    
                    appRef.current = null;
                } catch (error) {
                    console.error('Error during cleanup:', error);
                }
            }
            
            isReady.current = false;
        };
    }, [initializeApp, cleanup, entities, isPlaying, startAnimation]);

    // Efecto para manejar play/pause
    useEffect(() => {
        if (!isReady.current) return;

        if (isPlaying) {
            startAnimation();
        } else {
            stopAnimation();
        }
    }, [isPlaying, isReady.current, startAnimation, stopAnimation]);

    return {
        appRef,
        isReady,
        timeRef,
        restart,
        step
    };
}