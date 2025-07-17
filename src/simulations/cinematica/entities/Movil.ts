import { Vector2D } from "@/simulations/lib/utils";

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
    absolutePosition: Vector2D;
    absoluteRadius: number;

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
        this.absolutePosition = this.position.copy();
        this.radius = radius;
        this.absoluteRadius = this.radius;
        this.color = color;
    }

    update(deltaTime: number): void {
        if (deltaTime === 0) return;
        this.position.x += this.velocity.x * deltaTime / 1000 + this.acceleration.x * Math.pow((deltaTime / 1000), 2) / 2;
        this.position.y += this.velocity.y * deltaTime / 1000 + this.acceleration.y * Math.pow((deltaTime / 1000), 2) / 2;

        this.velocity.x += this.acceleration.x * deltaTime / 1000;
        this.velocity.y += this.acceleration.y * deltaTime / 1000;
    }

    absoluteMoveAndScale(deltaPosition: { x: number, y: number }, scale: number): void {
        this.absolutePosition.x = (this.position.x + deltaPosition.x) * scale;
        this.absolutePosition.y = (this.position.y * -1 + deltaPosition.y) * scale;
        this.absoluteRadius = this.radius * scale;
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.beginPath();
        ctx.arc(this.absolutePosition.x, this.absolutePosition.y, this.absoluteRadius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }

   drawVelocityVector(ctx: CanvasRenderingContext2D, scale: number): void {
        const endX = this.absolutePosition.x + this.velocity.x * scale;
        const endY = this.absolutePosition.y - this.velocity.y * scale;

        ctx.beginPath();
        ctx.moveTo(this.absolutePosition.x, this.absolutePosition.y);
        ctx.lineTo(endX, endY);
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.closePath();
        // Draw arrowhead as a triangle
        const arrowSize = this.absoluteRadius * 0.5;
        const angle = Math.atan2(endY - this.absolutePosition.y, endX - this.absolutePosition.x);
        ctx.beginPath();
        ctx.moveTo(endX, endY);
        ctx.lineTo(endX - arrowSize * Math.cos(angle - Math.PI / 6), endY - arrowSize * Math.sin(angle - Math.PI / 6));
        ctx.lineTo(endX - arrowSize * Math.cos(angle + Math.PI / 6), endY - arrowSize * Math.sin(angle + Math.PI / 6));
        ctx.lineTo(endX, endY);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }

    drawAccelerationVector(ctx: CanvasRenderingContext2D, scale: number): void {
        const endX = this.absolutePosition.x + this.acceleration.x * scale;
        const endY = this.absolutePosition.y - this.acceleration.y * scale;

        ctx.beginPath();
        ctx.moveTo(this.absolutePosition.x, this.absolutePosition.y);
        ctx.lineTo(endX, endY);
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.closePath();
        // Draw arrowhead as a triangle
        const arrowSize = this.absoluteRadius * 0.5;
        const angle = Math.atan2(endY - this.absolutePosition.y, endX - this.absolutePosition.x);
        ctx.beginPath();
        ctx.moveTo(endX, endY);
        ctx.lineTo(endX - arrowSize * Math.cos(angle - Math.PI / 6), endY - arrowSize * Math.sin(angle - Math.PI / 6));
        ctx.lineTo(endX - arrowSize * Math.cos(angle + Math.PI / 6), endY - arrowSize * Math.sin(angle + Math.PI / 6));
        ctx.lineTo(endX, endY);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
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