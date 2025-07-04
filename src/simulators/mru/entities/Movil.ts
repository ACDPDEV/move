import { Vector2D } from "@/lib/physicsUtils";

interface IMovilProps {
    id?: string;
    position: {x: number, y: number};
    velocity: {x: number, y: number};
    acceleration: {x: number, y: number};
    radius: number;
    color: string;
}

class Movil {
    id?: string;
    position: Vector2D;
    velocity: Vector2D;
    acceleration: Vector2D;
    radius: number;
    color: string;
    private initialPosition: Vector2D;
    private initialVelocity: Vector2D;
    private initialAcceleration: Vector2D;

    constructor({ 
        id,
        position, 
        velocity, 
        acceleration,
        radius, 
        color
    }: IMovilProps) {
        this.id = id;
        this.position = new Vector2D(position.x, position.y);
        this.velocity = new Vector2D(velocity.x, velocity.y);
        this.acceleration = new Vector2D(acceleration.x, acceleration.y);
        this.initialPosition = this.position.copy();
        this.initialVelocity = this.velocity.copy();
        this.initialAcceleration = this.acceleration.copy();
        this.radius = radius;
        this.color = color;
    }

    update(deltaTime: number): void {
        this.velocity.x += this.acceleration.x * deltaTime / 60;
        this.velocity.y += this.acceleration.y * deltaTime / 60;

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
    
    
    reset(): void {
        this.position = this.initialPosition.copy();
        this.velocity = this.initialVelocity.copy();
        this.acceleration = this.initialAcceleration.copy();
    }

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

export { Movil, type IMovilProps };