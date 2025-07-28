import { Vector2D } from '@/simulations/lib/utils';
import { v4 as uuidv4 } from 'uuid';
import { usePlaneStore } from '../store/usePlaneStore';

interface EntityProps {
    id?: string;
    position: { x: number; y: number };
    velocity: { x: number; y: number };
    acceleration: { x: number; y: number };
    radius: number;
    color: string;
}

// Tipo para las opciones de visualización de vectores
type VectorDisplayOptions = {
    resultant: boolean;
    components: boolean;
    angle: boolean;
};

type DisplayOptions = {
    position: VectorDisplayOptions;
    velocity: VectorDisplayOptions;
    acceleration: VectorDisplayOptions;
    trajectory: boolean;
    coordinates: boolean;
    axes: boolean;
};

class Entity {
    id: string;
    position: Vector2D;
    velocity: Vector2D;
    acceleration: Vector2D;
    radius: number;
    color: string;
    private trajectory: { x: number; y: number }[] = [];

    constructor({
        id,
        position,
        velocity,
        acceleration,
        radius,
        color,
    }: EntityProps) {
        this.id = id ?? (typeof window !== 'undefined' ? uuidv4() : '');
        this.position = new Vector2D(position.x, position.y);
        this.velocity = new Vector2D(velocity.x, velocity.y);
        this.acceleration = new Vector2D(acceleration.x, acceleration.y);
        this.radius = radius;
        this.color = color;
        this.trajectory = [this.position];
    }

    update(deltaTime: number): void {
        if (deltaTime === 0) return;

        // Guardar posición actual para la trayectoria
        this.trajectory.push(this.position.copy());

        // Limitar el tamaño de la trayectoria para optimización
        if (this.trajectory.length > 1000) {
            this.trajectory.shift();
        }

        // Actualización de posición usando ecuaciones cinemáticas
        this.position.x +=
            this.velocity.x * deltaTime +
            this.acceleration.x * deltaTime * deltaTime * 0.5;
        this.position.y +=
            this.velocity.y * deltaTime +
            this.acceleration.y * deltaTime * deltaTime * 0.5;

        // Actualización de velocidad
        this.velocity.x += this.acceleration.x * deltaTime;
        this.velocity.y += this.acceleration.y * deltaTime;
    }

    draw(ctx: CanvasRenderingContext2D): void {
        const plane = usePlaneStore.getState();
        const { width, height } = ctx.canvas;

        const [eX, eY, eRadius] = [
            (this.position.x + plane.position.x) * plane.scale,
            (this.position.y + plane.position.y) * plane.scale * -1,
            this.radius * plane.scale,
        ];

        if (eX >= 0 && eX <= width && eY >= 0 && eY <= height) {
            ctx.beginPath();
            ctx.arc(eX, eY, eRadius, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
            ctx.closePath();
        }
    }

    drawTrajectory(ctx: CanvasRenderingContext2D): void {
        const plane = usePlaneStore.getState();

        ctx.beginPath();
        ctx.strokeStyle = this.color;
        ctx.globalAlpha = 0.6;
        ctx.lineWidth = 1;

        // Convertir primera posición de la trayectoria
        const firstPos = this.trajectory[0];
        let absX = (firstPos.x + plane.position.x) * plane.scale;
        let absY = (firstPos.y + plane.position.y) * plane.scale * -1;
        ctx.moveTo(absX, absY);

        // Dibujar el resto de la trayectoria
        for (let i = 1; i < this.trajectory.length; i++) {
            const pos = this.trajectory[i];
            absX = (pos.x + plane.position.x) * plane.scale;
            absY = (pos.y + plane.position.y) * plane.scale * -1;
            ctx.lineTo(absX, absY);
        }

        ctx.stroke();
        ctx.globalAlpha = 1.0;
        ctx.closePath();
    }

    resetTrajectory(): void {
        this.trajectory = [this.position];
    }

    drawPositionVectorResultant(ctx: CanvasRenderingContext2D): void {
        const plane = usePlaneStore.getState();
        const { width, height } = ctx.canvas;

        const [pX, pY] = [
            plane.position.x * plane.scale,
            plane.position.y * plane.scale * -1,
        ];

        const [eX, eY] = [
            (this.position.x + plane.position.x) * plane.scale,
            (this.position.y + plane.position.y) * plane.scale * -1,
        ];

        if (
            eX >= 0 ||
            eX <= width ||
            eY >= 0 ||
            eY <= height ||
            pX >= 0 ||
            pX <= width ||
            pY >= 0 ||
            pY <= height
        ) {
            ctx.beginPath();
            ctx.moveTo(pX, pY);
            ctx.lineTo(eX, eY);
            ctx.strokeStyle = this.color;
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.closePath();
        }
    }

    drawPositionVectorComponents(ctx: CanvasRenderingContext2D): void {
        const plane = usePlaneStore.getState();
        const { width, height } = ctx.canvas;

        const [pX, pY] = [
            plane.position.x * plane.scale,
            plane.position.y * plane.scale * -1,
        ];

        const [eX, eY] = [
            (this.position.x + plane.position.x) * plane.scale,
            (this.position.y + plane.position.y) * plane.scale * -1,
        ];

        if (
            eX >= 0 ||
            eX <= width ||
            eY >= 0 ||
            eY <= height ||
            pX >= 0 ||
            pX <= width ||
            pY >= 0 ||
            pY <= height
        ) {
            ctx.beginPath();
            ctx.moveTo(pX, pY);
            ctx.lineTo(eX, pY);
            ctx.strokeStyle = this.color;
            ctx.lineWidth = 1;
            ctx.stroke();
            ctx.closePath();

            ctx.beginPath();
            ctx.moveTo(pX, pY);
            ctx.lineTo(pX, eY);
            ctx.strokeStyle = this.color;
            ctx.lineWidth = 1;
            ctx.stroke();
            ctx.closePath();
        }
    }

    drawPositionVectorAngle(ctx: CanvasRenderingContext2D): void {}

    drawVelocityVectorResultant(ctx: CanvasRenderingContext2D): void {
        const plane = usePlaneStore.getState();
        const { width, height } = ctx.canvas;

        const [eX, eY] = [
            (this.position.x + plane.position.x) * plane.scale,
            (this.position.y + plane.position.y) * plane.scale * -1,
        ];

        const [vX, vY] = [
            eX + this.velocity.x * plane.scale,
            eY + this.velocity.y * plane.scale * -1,
        ];

        if (
            eX >= 0 ||
            eX <= width ||
            eY >= 0 ||
            eY <= height ||
            vX >= 0 ||
            vX <= width ||
            vY >= 0 ||
            vY <= height
        ) {
            ctx.beginPath();
            ctx.moveTo(eX, eY);
            ctx.lineTo(vX, vY);
            ctx.strokeStyle = this.color;
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.closePath();
        }
    }

    drawVelocityVectorComponents(ctx: CanvasRenderingContext2D): void {
        const plane = usePlaneStore.getState();
        const { width, height } = ctx.canvas;

        const [eX, eY] = [
            (this.position.x + plane.position.x) * plane.scale,
            (this.position.y + plane.position.y) * plane.scale * -1,
        ];

        const [vX, vY] = [
            eX + this.velocity.x * plane.scale,
            eY + this.velocity.y * plane.scale * -1,
        ];

        if (
            eX >= 0 ||
            eX <= width ||
            eY >= 0 ||
            eY <= height ||
            vX >= 0 ||
            vX <= width ||
            vY >= 0 ||
            vY <= height
        ) {
            ctx.beginPath();
            ctx.moveTo(eX, eY);
            ctx.lineTo(vX, eY);
            ctx.strokeStyle = this.color;
            ctx.lineWidth = 1;
            ctx.stroke();
            ctx.closePath();

            ctx.beginPath();
            ctx.moveTo(eX, eY);
            ctx.lineTo(eX, vY);
            ctx.strokeStyle = this.color;
            ctx.lineWidth = 1;
            ctx.stroke();
            ctx.closePath();
        }
    }

    drawVelocityVectorAngle(ctx: CanvasRenderingContext2D): void {}

    drawAccelerationVectorResultant(ctx: CanvasRenderingContext2D): void {
        const plane = usePlaneStore.getState();
        const { width, height } = ctx.canvas;

        const [eX, eY] = [
            (this.position.x + plane.position.x) * plane.scale,
            (this.position.y + plane.position.y) * plane.scale * -1,
        ];

        const [aX, aY] = [
            eX + this.acceleration.x * plane.scale,
            eY + this.acceleration.y * plane.scale * -1,
        ];

        if (
            eX >= 0 ||
            eX <= width ||
            eY >= 0 ||
            eY <= height ||
            aX >= 0 ||
            aX <= width ||
            aY >= 0 ||
            aY <= height
        ) {
            ctx.beginPath();
            ctx.strokeStyle = this.color;
            ctx.lineWidth = 2;
            ctx.moveTo(eX, eY);
            ctx.lineTo(aX, aY);
            ctx.stroke();
            ctx.closePath();
        }
    }
    drawAccelerationVectorComponents(ctx: CanvasRenderingContext2D): void {
        const plane = usePlaneStore.getState();
        const { width, height } = ctx.canvas;
        const [eX, eY] = [
            (this.position.x + plane.position.x) * plane.scale,
            (this.position.y + plane.position.y) * plane.scale * -1,
        ];
        const [aX, aY] = [
            eX + this.acceleration.x * plane.scale,
            eY + this.acceleration.y * plane.scale * -1,
        ];
        if (
            eX >= 0 ||
            eX <= width ||
            eY >= 0 ||
            eY <= height ||
            aX >= 0 ||
            aX <= width ||
            aY >= 0 ||
            aY <= height
        ) {
            ctx.beginPath();
            ctx.strokeStyle = this.color;
            ctx.lineWidth = 1;
            ctx.moveTo(eX, eY);
            ctx.lineTo(aX, eY);
            ctx.stroke();
            ctx.closePath();
            ctx.beginPath();
            ctx.strokeStyle = this.color;
            ctx.lineWidth = 1;
            ctx.moveTo(eX, eY);
            ctx.lineTo(eX, aY);
            ctx.stroke();
            ctx.closePath();
        }
    }
    drawAccelerationVectorAngle(ctx: CanvasRenderingContext2D): void {}

    toString(): string {
        return `Movil {
            position: (${this.position.x.toFixed(2)}, ${this.position.y.toFixed(
            2,
        )}), 
            velocity: (${this.velocity.x.toFixed(2)}, ${this.velocity.y.toFixed(
            2,
        )}),
            acceleration: (${this.acceleration.x.toFixed(
                2,
            )}, ${this.acceleration.y.toFixed(2)})
        }`;
    }

    getDebugInfo(): string {
        return `
        Posición: (${this.position.x.toFixed(2)}, ${this.position.y.toFixed(2)})
        Velocidad: (${this.velocity.x.toFixed(2)}, ${this.velocity.y.toFixed(
            2,
        )})
        Aceleración: (${this.acceleration.x.toFixed(
            2,
        )}, ${this.acceleration.y.toFixed(2)})
        Radio: ${this.radius}
        Color: ${this.color}
        `;
    }

    clone(): Entity {
        return new Entity({
            position: this.position.copy(),
            velocity: this.velocity.copy(),
            acceleration: this.acceleration.copy(),
            radius: this.radius,
            color: this.color,
        });
    }

    toProps() {
        return {
            id: this.id,
            position: this.position,
            velocity: this.velocity,
            acceleration: this.acceleration,
            radius: this.radius,
            color: this.color,
        };
    }
}

export { Entity, type EntityProps, type DisplayOptions };
