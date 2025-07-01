import { Vector2D } from "@/lib/physicsUtils";
import type { Application, Ticker } from "pixi.js";
import { Graphics } from "pixi.js";
import graphicsPool from "../utils/GraphicsPool";

export interface IMovilProps {
    id?: string;  // Make id optional
    position: Vector2D;
    velocity: Vector2D;
    acceleration: Vector2D;
    radius?: number;
    color?: number;
}

class Movil {
    id?: string;
    position: Vector2D;
    velocity: Vector2D;
    acceleration: Vector2D;
    private initialPosition: Vector2D;
    private initialVelocity: Vector2D;
    private initialAcceleration: Vector2D;
    graphics: Graphics | null = null;
    private _radius: number;
    private _color: number;

    // Getters públicos para acceder a las propiedades privadas
    get radius(): number {
        return this._radius;
    }

    get color(): number {
        return this._color;
    }

    constructor({ 
        id,
        position, 
        velocity, 
        acceleration = new Vector2D(0, 0),
        radius = 10, 
        color = 0xFF0000 
    }: IMovilProps) {
        this.id = id;
        this.position = position.copy();
        this.velocity = velocity.copy();
        this.acceleration = acceleration.copy();
        this.initialPosition = position.copy();
        this.initialVelocity = velocity.copy();
        this.initialAcceleration = acceleration.copy();
        this._radius = radius;
        this._color = color;
    }

    update(deltaTime: number): void {
        // Apply acceleration to velocity
        this.velocity.x += this.acceleration.x * deltaTime;
        this.velocity.y += this.acceleration.y * deltaTime;

        // Update position based on velocity
        this.position.x += this.velocity.x * deltaTime;
        this.position.y += this.velocity.y * deltaTime;
    }

    /**
     * Dibuja el móvil en el escenario de PixiJS
     * @param app Instancia de la aplicación PixiJS
     */
    draw(app: Application): void {
        if (!this.graphics || this.graphics.destroyed) {
            // Get a graphics object from the pool
            this.graphics = graphicsPool.get();
            app.stage.addChild(this.graphics);
        }
        
        this.graphics.clear();
        this.graphics.beginFill(this.color);
        this.graphics.drawCircle(0, 0, this.radius);
        this.graphics.endFill();
        
        // Update position
        this.graphics.position.set(this.position.x, this.position.y);
    }
    
    /**
     * Reinicia el móvil a su posición y velocidad iniciales
     */
    reset(): void {
        this.position = this.initialPosition.copy();
        this.velocity = this.initialVelocity.copy();
        this.acceleration = this.initialAcceleration.copy();
    }

    /**
     * Clean up resources when the entity is destroyed
     */
    destroy(): void {
        if (this.graphics) {
            // Return the graphics object to the pool
            graphicsPool.release(this.graphics);
            this.graphics = null;
        }
    }

    /**
     * Obtiene una representación en cadena del móvil
     */
    toString(): string {
        return `Movil {
            position: (${this.position.x.toFixed(2)}, ${this.position.y.toFixed(2)}), 
            velocity: (${this.velocity.x.toFixed(2)}, ${this.velocity.y.toFixed(2)}),
            acceleration: (${this.acceleration.x.toFixed(2)}, ${this.acceleration.y.toFixed(2)})
        }`;
    }

    getDebugInfo(): string {
        return `
        Posición: (${this.position.x.toFixed(2)}, ${this.position.y.toFixed(2)})
        Velocidad: (${this.velocity.x.toFixed(2)}, ${this.velocity.y.toFixed(2)})
        Aceleración: (${this.acceleration.x.toFixed(2)}, ${this.acceleration.y.toFixed(2)})
        Radio: ${this.radius}
        Color: #${this.color.toString(16).padStart(6, '0')}
        `;
    }
}
export { Movil };