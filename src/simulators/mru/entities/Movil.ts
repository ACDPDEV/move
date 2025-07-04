import { Vector2D } from "@/lib/physicsUtils";

export interface IMovilProps {
    id?: string;  // Make id optional
    position: Vector2D;
    velocity: Vector2D;
    acceleration: Vector2D;
    radius?: number;
    color?: string;
}

class Movil {
    id?: string;
    position: Vector2D;
    velocity: Vector2D;
    acceleration: Vector2D;
    private initialPosition: Vector2D;
    private initialVelocity: Vector2D;
    private initialAcceleration: Vector2D;
    public _radius: number;  // Hacer público para permitir mutación
    public _color: string;   // Hacer público para permitir mutación

    // Getters públicos para acceder a las propiedades
    get radius(): number {
        return this._radius;
    }

    get color(): string {
        return this._color;
    }

    // Setters públicos para permitir mutación
    set radius(value: number) {
        this._radius = value;
    }

    set color(value: string) {
        this._color = value;
    }

    constructor({ 
        id,
        position, 
        velocity, 
        acceleration = new Vector2D(0, 0),
        radius = 10, 
        color = "#000000"
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
        this.velocity.x += this.acceleration.x * deltaTime / 60;
        this.velocity.y += this.acceleration.y * deltaTime / 60;

        // Update position based on velocity
        this.position.x += this.velocity.x * deltaTime / 60;
        this.position.y += this.velocity.y * deltaTime / 60;
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
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
        // @ts-ignore - Permitir asignación undefined para cleanup
        this.position = undefined;
        // @ts-ignore
        this.velocity = undefined;
        // @ts-ignore
        this.acceleration = undefined;
        // @ts-ignore
        this.initialPosition = undefined;
        // @ts-ignore
        this.initialVelocity = undefined;
        // @ts-ignore
        this.initialAcceleration = undefined;
        // @ts-ignore
        this._radius = undefined;
        // @ts-ignore
        this._color = undefined;
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
        Color: ${this.color}
        `;
    }
}
export { Movil };