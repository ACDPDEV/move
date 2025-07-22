import { Vector2D } from '@/simulations/lib/utils';
import { v4 as uuidv4 } from 'uuid';

interface EntityProps {
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
    id: string | undefined;
    position: Vector2D;
    velocity: Vector2D;
    acceleration: Vector2D;
    radius: number;
    color: string;
    absolutePosition: Vector2D;
    absoluteRadius: number;
    private trajectory: Vector2D[] = [];

    constructor({
        position,
        velocity,
        acceleration,
        radius,
        color,
    }: EntityProps) {
        this.id = typeof window !== 'undefined' ? uuidv4() : undefined;
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

    absoluteMoveAndScale(
        deltaPosition: { x: number; y: number },
        scale: number,
    ): void {
        this.absolutePosition.x = (this.position.x + deltaPosition.x) * scale;
        this.absolutePosition.y =
            (this.position.y * -1 + deltaPosition.y) * scale;
        this.absoluteRadius = this.radius * scale;
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.beginPath();
        ctx.arc(
            this.absolutePosition.x,
            this.absolutePosition.y,
            this.absoluteRadius,
            0,
            Math.PI * 2,
        );
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }

    drawTrajectory(
        ctx: CanvasRenderingContext2D,
        deltaPosition: { x: number; y: number },
        scale: number,
    ): void {
        if (this.trajectory.length < 2) return;

        ctx.beginPath();
        ctx.strokeStyle = this.color;
        ctx.globalAlpha = 0.6;
        ctx.lineWidth = 1;

        // Convertir primera posición de la trayectoria
        const firstPos = this.trajectory[0];
        let absX = (firstPos.x + deltaPosition.x) * scale;
        let absY = (firstPos.y * -1 + deltaPosition.y) * scale;
        ctx.moveTo(absX, absY);

        // Dibujar el resto de la trayectoria
        for (let i = 1; i < this.trajectory.length; i++) {
            const pos = this.trajectory[i];
            absX = (pos.x + deltaPosition.x) * scale;
            absY = (pos.y * -1 + deltaPosition.y) * scale;
            ctx.lineTo(absX, absY);
        }

        ctx.stroke();
        ctx.globalAlpha = 1.0;
        ctx.closePath();
    }

    private drawArrowHead(
        ctx: CanvasRenderingContext2D,
        startX: number,
        startY: number,
        endX: number,
        endY: number,
    ): void {
        const arrowSize = Math.max(6, this.absoluteRadius * 0.5);
        const angle = Math.atan2(endY - startY, endX - startX);

        ctx.beginPath();
        ctx.moveTo(endX, endY);
        ctx.lineTo(
            endX - arrowSize * Math.cos(angle - Math.PI / 6),
            endY - arrowSize * Math.sin(angle - Math.PI / 6),
        );
        ctx.lineTo(
            endX - arrowSize * Math.cos(angle + Math.PI / 6),
            endY - arrowSize * Math.sin(angle + Math.PI / 6),
        );
        ctx.lineTo(endX, endY);
        ctx.fillStyle = ctx.strokeStyle;
        ctx.fill();
        ctx.closePath();
    }

    private drawVectorComponent(
        ctx: CanvasRenderingContext2D,
        component: 'x' | 'y',
        vector: Vector2D,
        scale: number,
        color: string,
    ): void {
        const startX = this.absolutePosition.x;
        const startY = this.absolutePosition.y;
        let endX = startX;
        let endY = startY;

        if (component === 'x') {
            endX = startX + vector.x * scale;
        } else {
            endY = startY - vector.y * scale;
        }

        // Solo dibujar si el vector tiene magnitud
        if (Math.abs(endX - startX) > 1 || Math.abs(endY - startY) > 1) {
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(endX, endY);
            ctx.strokeStyle = color;
            ctx.lineWidth = 1;
            ctx.setLineDash([5, 5]);
            ctx.stroke();
            ctx.setLineDash([]);

            this.drawArrowHead(ctx, startX, startY, endX, endY);
            ctx.closePath();
        }
    }

    private drawVector(
        ctx: CanvasRenderingContext2D,
        vector: Vector2D,
        scale: number,
        color: string,
        options: VectorDisplayOptions,
    ): void {
        // Dibujar vector resultante
        if (options.resultant) {
            const endX = this.absolutePosition.x + vector.x * scale;
            const endY = this.absolutePosition.y - vector.y * scale;

            // Solo dibujar si el vector tiene magnitud significativa
            const magnitude = Math.sqrt(
                vector.x * vector.x + vector.y * vector.y,
            );
            if (magnitude * scale > 2) {
                ctx.beginPath();
                ctx.moveTo(this.absolutePosition.x, this.absolutePosition.y);
                ctx.lineTo(endX, endY);
                ctx.strokeStyle = color;
                ctx.lineWidth = 2;
                ctx.stroke();
                ctx.closePath();

                this.drawArrowHead(
                    ctx,
                    this.absolutePosition.x,
                    this.absolutePosition.y,
                    endX,
                    endY,
                );
            }
        }

        // Dibujar componentes
        if (options.components) {
            this.drawVectorComponent(ctx, 'x', vector, scale, color + '80');
            this.drawVectorComponent(ctx, 'y', vector, scale, color + '80');
        }

        // Dibujar ángulo
        if (options.angle && vector.mag() > 0.1) {
            this.drawAngle(ctx, vector, scale, color);
        }
    }

    private drawAngle(
        ctx: CanvasRenderingContext2D,
        vector: Vector2D,
        scale: number,
        color: string,
    ): void {
        const angle = Math.atan2(-vector.y, vector.x); // Negativo porque Y está invertido
        const radius = Math.min(30, this.absoluteRadius * 2);

        ctx.beginPath();
        ctx.arc(
            this.absolutePosition.x,
            this.absolutePosition.y,
            radius,
            0,
            angle,
            false,
        );
        ctx.strokeStyle = color + '60';
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.closePath();

        // Mostrar el valor del ángulo
        const textX = this.absolutePosition.x + radius + 5;
        const textY = this.absolutePosition.y;
        ctx.fillStyle = color;
        ctx.font = '12px Arial';
        ctx.fillText(`${((angle * 180) / Math.PI).toFixed(1)}°`, textX, textY);
    }

    drawVectors(
        ctx: CanvasRenderingContext2D,
        scale: number,
        displayOptions: DisplayOptions,
    ): void {
        // Dibujar vector de velocidad
        if (
            displayOptions.velocity.resultant ||
            displayOptions.velocity.components ||
            displayOptions.velocity.angle
        ) {
            this.drawVector(
                ctx,
                this.velocity,
                scale,
                '#00FF00',
                displayOptions.velocity,
            );
        }

        // Dibujar vector de aceleración
        if (
            displayOptions.acceleration.resultant ||
            displayOptions.acceleration.components ||
            displayOptions.acceleration.angle
        ) {
            this.drawVector(
                ctx,
                this.acceleration,
                scale,
                '#FF0000',
                displayOptions.acceleration,
            );
        }

        // Dibujar vector de posición (desde el origen)
        if (
            displayOptions.position.resultant ||
            displayOptions.position.components ||
            displayOptions.position.angle
        ) {
            // Para el vector posición, necesitamos dibujarlo desde el origen
            const originX = this.absolutePosition.x - this.position.x * scale;
            const originY = this.absolutePosition.y + this.position.y * scale;

            ctx.save();
            ctx.translate(originX, originY);
            const tempAbsPos = this.absolutePosition;
            this.absolutePosition = new Vector2D(0, 0);
            this.drawVector(
                ctx,
                this.position,
                scale,
                '#FFFF00',
                displayOptions.position,
            );
            this.absolutePosition = tempAbsPos;
            ctx.restore();
        }
    }

    drawCoordinates(ctx: CanvasRenderingContext2D): void {
        const textX = this.absolutePosition.x + this.absoluteRadius + 5;
        const textY = this.absolutePosition.y - this.absoluteRadius - 5;

        ctx.fillStyle = this.color;
        ctx.font = '12px Arial';
        ctx.fillText(
            `(${this.position.x.toFixed(1)}, ${this.position.y.toFixed(1)})`,
            textX,
            textY,
        );
    }

    resetTrajectory(): void {
        this.trajectory = [];
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
}

export { Entity, type EntityProps, type DisplayOptions };
