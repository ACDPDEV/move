import { Graphics } from 'pixi.js';

/**
 * A simple object pool for PixiJS Graphics objects to improve performance
 * by reusing graphics objects instead of creating and destroying them.
 */
export class GraphicsPool {
    private static instance: GraphicsPool;
    private pool: Graphics[] = [];
    private activeGraphics: Set<Graphics> = new Set();

    private constructor() {}

    /**
     * Get the singleton instance of GraphicsPool
     */
    public static getInstance(): GraphicsPool {
        if (!GraphicsPool.instance) {
            GraphicsPool.instance = new GraphicsPool();
        }
        return GraphicsPool.instance;
    }

    /**
     * Get a Graphics object from the pool or create a new one if the pool is empty
     */
    public get(): Graphics {
        let graphics: Graphics;

        if (this.pool.length > 0) {
            graphics = this.pool.pop()!;
        } else {
            graphics = new Graphics();
        }

        this.activeGraphics.add(graphics);
        return graphics;
    }

    /**
     * Return a Graphics object to the pool for reuse
     */
    public release(graphics: Graphics): void {
        if (!graphics) return;

        // Clear the graphics object
        graphics.clear();
        graphics.scale.set(1, 1);
        graphics.rotation = 0;
        graphics.alpha = 1;
        graphics.tint = 0xFFFFFF;
        graphics.filters = [];
        graphics.mask = null;
        graphics.parent?.removeChild(graphics);

        // Remove from active set and add to pool
        this.activeGraphics.delete(graphics);
        this.pool.push(graphics);
    }

    /**
     * Clear all graphics from the pool
     */
    public clear(): void {
        // Destroy all graphics in the pool
        this.pool.forEach(graphics => graphics.destroy());
        
        // Clear active graphics
        Array.from(this.activeGraphics).forEach(graphics => graphics.destroy());
        
        this.pool = [];
        this.activeGraphics.clear();
    }

    /**
     * Get the number of available graphics in the pool
     */
    public get availableCount(): number {
        return this.pool.length;
    }

    /**
     * Get the number of active (in-use) graphics
     */
    public get activeCount(): number {
        return this.activeGraphics.size;
    }
}

export default GraphicsPool.getInstance();
