import { Vector2D } from '@/simulations/lib/utils';
import { v4 as uuidv4 } from 'uuid';
import { usePlaneStore } from '../stores/usePlaneStore';

interface EntityProps {
    id?: string;
    position: { x: number; y: number };
    velocity: { x: number; y: number };
    acceleration: { x: number; y: number };
    shape: 'circle' | 'square' | 'triangle';
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
    initialPosition: { x: number; y: number };
    initialVelocity: { x: number; y: number };
    initialAcceleration: { x: number; y: number };
    radius: number;
    shape: 'circle' | 'square' | 'triangle';
    color: string;
    private trajectory: { x: number; y: number }[] = [];

    constructor({
        id,
        position,
        velocity,
        acceleration,
        radius,
        shape,
        color,
    }: EntityProps) {
        this.id = id ?? (typeof window !== 'undefined' ? uuidv4() : '');
        this.position = new Vector2D(position.x, position.y);
        this.velocity = new Vector2D(velocity.x, velocity.y);
        this.acceleration = new Vector2D(acceleration.x, acceleration.y);
        this.initialPosition = position;
        this.initialVelocity = velocity;
        this.initialAcceleration = acceleration;
        this.radius = radius;
        this.shape = shape;
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

    draw(ctx: CanvasRenderingContext2D, borderColor?: string): void {
        const plane = usePlaneStore.getState();
        const { width, height } = ctx.canvas;

        const eX = (this.position.x + plane.position.x) * plane.scale;
        const eY = (this.position.y + plane.position.y) * plane.scale * -1;
        const eRadius = this.radius * plane.scale;

        if (
            eX + eRadius >= 0 &&
            eX - eRadius <= width &&
            eY + eRadius >= 0 &&
            eY - eRadius <= height
        ) {
            ctx.beginPath();
            if (borderColor) {
                ctx.strokeStyle = borderColor;
                ctx.lineWidth = 2;
                ctx.lineJoin = 'round';
            }

            const corner = eRadius * 0.15;

            if (this.shape === 'circle') {
                ctx.arc(eX, eY, eRadius, 0, Math.PI * 2);
            } else if (this.shape === 'square') {
                const x0 = eX - eRadius;
                const y0 = eY - eRadius;
                const size = eRadius * 2;
                ctx.moveTo(x0 + corner, y0);
                ctx.lineTo(x0 + size - corner, y0);
                ctx.arcTo(x0 + size, y0, x0 + size, y0 + corner, corner);
                ctx.lineTo(x0 + size, y0 + size - corner);
                ctx.arcTo(
                    x0 + size,
                    y0 + size,
                    x0 + size - corner,
                    y0 + size,
                    corner,
                );
                ctx.lineTo(x0 + corner, y0 + size);
                ctx.arcTo(x0, y0 + size, x0, y0 + size - corner, corner);
                ctx.lineTo(x0, y0 + corner);
                ctx.arcTo(x0, y0, x0 + corner, y0, corner);
                ctx.closePath();
            } else if (this.shape === 'triangle') {
                // Puntos del triángulo
                const p1 = [eX, eY - eRadius]; // Vértice superior
                const p2 = [eX + eRadius, eY + eRadius]; // Vértice inferior derecho
                const p3 = [eX - eRadius, eY + eRadius]; // Vértice inferior izquierdo

                // Calcular puntos para las esquinas redondeadas
                // Para cada lado, necesitamos los puntos donde comienzan y terminan las curvas

                // Lado 1 (p1 a p2)
                const d12 = Math.sqrt(
                    (p2[0] - p1[0]) ** 2 + (p2[1] - p1[1]) ** 2,
                );
                const ratio12 = corner / d12;
                const start12 = [
                    p1[0] + (p2[0] - p1[0]) * ratio12,
                    p1[1] + (p2[1] - p1[1]) * ratio12,
                ];
                const end12 = [
                    p2[0] - (p2[0] - p1[0]) * ratio12,
                    p2[1] - (p2[1] - p1[1]) * ratio12,
                ];

                // Lado 2 (p2 a p3)
                const d23 = Math.sqrt(
                    (p3[0] - p2[0]) ** 2 + (p3[1] - p2[1]) ** 2,
                );
                const ratio23 = corner / d23;
                const start23 = [
                    p2[0] + (p3[0] - p2[0]) * ratio23,
                    p2[1] + (p3[1] - p2[1]) * ratio23,
                ];
                const end23 = [
                    p3[0] - (p3[0] - p2[0]) * ratio23,
                    p3[1] - (p3[1] - p2[1]) * ratio23,
                ];

                // Lado 3 (p3 a p1)
                const d31 = Math.sqrt(
                    (p1[0] - p3[0]) ** 2 + (p1[1] - p3[1]) ** 2,
                );
                const ratio31 = corner / d31;
                const start31 = [
                    p3[0] + (p1[0] - p3[0]) * ratio31,
                    p3[1] + (p1[1] - p3[1]) * ratio31,
                ];
                const end31 = [
                    p1[0] - (p1[0] - p3[0]) * ratio31,
                    p1[1] - (p1[1] - p3[1]) * ratio31,
                ];

                // Dibujar el triángulo con esquinas redondeadas
                ctx.moveTo(start12[0], start12[1]);
                ctx.lineTo(end12[0], end12[1]);
                ctx.arcTo(p2[0], p2[1], start23[0], start23[1], corner);
                ctx.lineTo(end23[0], end23[1]);
                ctx.arcTo(p3[0], p3[1], start31[0], start31[1], corner);
                ctx.lineTo(end31[0], end31[1]);
                ctx.arcTo(p1[0], p1[1], start12[0], start12[1], corner);
                ctx.closePath();
            }

            ctx.fillStyle = this.color;
            ctx.fill();

            if (borderColor) {
                ctx.stroke();
            }
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

    setInitialProperties() {
        this.initialPosition = { x: this.position.x, y: this.position.y };
        this.initialVelocity = { x: this.velocity.x, y: this.velocity.y };
        this.initialAcceleration = {
            x: this.acceleration.x,
            y: this.acceleration.y,
        };
    }

    resetProperties() {
        this.position = new Vector2D(
            this.initialPosition.x,
            this.initialPosition.y,
        );
        this.velocity = new Vector2D(
            this.initialVelocity.x,
            this.initialVelocity.y,
        );
        this.acceleration = new Vector2D(
            this.initialAcceleration.x,
            this.initialAcceleration.y,
        );
    }

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
        Forma: ${this.shape}
        Color: ${this.color}
        `;
    }

    clone(): Entity {
        return new Entity({
            position: this.position.copy(),
            velocity: this.velocity.copy(),
            acceleration: this.acceleration.copy(),
            radius: this.radius,
            shape: this.shape,
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
            shape: this.shape,
            color: this.color,
        };
    }
}

export { Entity, type EntityProps, type DisplayOptions };
