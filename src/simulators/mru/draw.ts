import { type Application, type Ticker, Graphics } from 'pixi.js';
import { type Movil } from '@/simulators/mru/entities/Movil';

/**
 * Prepara los recursos necesarios para la simulación
 * En una simulación más compleja, aquí cargarías texturas, sonidos, etc.
 */
async function preload(): Promise<void> {
    // Placeholder para carga de recursos
    // Por ejemplo: await Assets.load(['texture1.png', 'sound1.mp3']);
    console.log('Recursos cargados');
}

/**
 * Configura la aplicación PixiJS
 * Inicializa la aplicación con las configuraciones necesarias
 */
async function setup(
    app: Application, 
    canvas: HTMLCanvasElement, 
    container: HTMLElement
): Promise<void> {
    console.log('Configurando aplicación PixiJS');
    
    try {
        await app.init({
            preference: 'webgpu',
            canvas: canvas,
            resizeTo: container,
            background: '#333333', // Cambio de backgroundColor a background (PixiJS v8)
            autoStart: false,
            sharedTicker: false,
        });
        
        // Agregar el canvas al contenedor si no está ya agregado
        if (!container.contains(canvas)) {
            container.appendChild(app.canvas);
        }
        
        console.log('Aplicación PixiJS configurada correctamente');
    } catch (error) {
        console.error('Error al configurar PixiJS:', error);
        throw error;
    }
}

/**
 * Bucle principal de la simulación
 * Actualiza las entidades y las renderiza en cada frame
 */
// Cache for performance
let lastEntities: Movil[] = [];

function loop(
    app: Application, 
    [entities, setEntities]: [Movil[], (entities: Movil[]) => void], 
    deltaTime: number
): void {
    // Only update if entities have changed
    const entitiesChanged = entities.length !== lastEntities.length || 
        entities.some((e, i) => e !== lastEntities[i]);
    
    if (entitiesChanged) {
        // Clean up old entities that are no longer in the list
        lastEntities.forEach(oldEntity => {
            if (!entities.includes(oldEntity) && oldEntity.graphics) {
                oldEntity.destroy();
            }
        });
        
        // Update the cache
        lastEntities = [...entities];
    }
    
    // Update and draw each entity
    entities.forEach(entity => {
        // Update the entity
        entity.update(deltaTime);
        
        // Draw the entity
        entity.draw(app);
    });

    // Always render for now - in a real app, we'd track changes to the scene graph
    // to determine if a render is actually needed
    app.render();
}

/**
 * Limpia los recursos de la simulación
 * Libera memoria y recursos utilizados
 */
function cleanup(app: Application, entities: Movil[]): void {
    console.log('Limpiando recursos de la simulación');
    
    // Limpiar la caché de entidades
    lastEntities = [];
    
    // Limpiar cada entidad de manera segura
    entities.forEach(entity => {
        try {
            if (entity && typeof entity.destroy === 'function') {
                entity.destroy();
            }
        } catch (e) {
            console.warn(`Error al limpiar entidad ${entity.id}:`, e);
        }
    });
    
    // Limpiar el stage de manera segura
    try {
        if (app.stage) {
            // Remover todos los hijos del stage
            app.stage.removeChildren();
            
            // Limpiar cualquier filtro o máscara
            app.stage.filters = null;
            app.stage.mask = null;
        }
        
        // Limpiar el renderizador
        if (app.renderer) {
            // Limpiar caché de texturas si está disponible
            if ('texture' in app.renderer && app.renderer.texture) {
                // @ts-ignore - destroyAll might not be in the type definitions
                if (typeof app.renderer.texture.destroyAll === 'function') {
                    // @ts-ignore
                    app.renderer.texture.destroyAll();
                } else if (typeof app.renderer.texture.destroy === 'function') {
                    // @ts-ignore
                    app.renderer.texture.destroy(true);
                }
            }
            
            // Liberar recursos de renderizado si está disponible
            if ('reset' in app.renderer && typeof app.renderer.reset === 'function') {
                // @ts-ignore - reset might not be in the type definitions
                app.renderer.reset();
            }
        }
    } catch (e) {
        console.warn('Error al limpiar el stage o el renderizador:', e);
    }
    
    // Detener y destruir la aplicación de manera segura
    try {
        // Detener cualquier animación en curso
        app.ticker?.stop();
        
        // Destruir la aplicación
        app.destroy({
            children: true,    // Destruir todos los hijos
            texture: true,    // Destruir texturas
            context: true,    // Destruir contexto WebGL
            removeView: false // No remover el elemento canvas del DOM
        } as any); // Using type assertion for compatibility
        
        // Limpiar referencias
        if (app.canvas) {
            app.canvas.width = 1;
            app.canvas.height = 1;
        }
    } catch (e) {
        console.warn('Error al destruir la aplicación PixiJS:', e);
    }
    
    console.log('Recursos de la simulación limpiados');
}

export { preload, setup, loop, cleanup };