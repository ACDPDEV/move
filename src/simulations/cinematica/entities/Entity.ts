// /simulations/entities/Entity.ts
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
    shape: 'circle' | 'square' | 'triangle';
    color: string;
    private trajectory: Vector2D[] = [];

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
        this.radius = radius;
        this.shape = shape;
        this.color = color;
        this.trajectory = [this.position.copy()];
    }

    private drawArrow(
        ctx: CanvasRenderingContext2D,
        fromX: number,
        fromY: number,
        toX: number,
        toY: number,
        lineWidth: number,
    ) {
        const angle = Math.atan2(toY - fromY, toX - fromX);
        const headLen = 10;
        ctx.beginPath();
        ctx.moveTo(fromX, fromY);
        ctx.lineTo(toX, toY);
        ctx.lineWidth = lineWidth;
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(toX, toY);
        ctx.lineTo(
            toX - headLen * Math.cos(angle - Math.PI / 6),
            toY - headLen * Math.sin(angle - Math.PI / 6),
        );
        ctx.lineTo(
            toX - headLen * Math.cos(angle + Math.PI / 6),
            toY - headLen * Math.sin(angle + Math.PI / 6),
        );
        ctx.lineTo(toX, toY);
        ctx.fill();
        ctx.closePath();
    }

    private drawAngle(
        ctx: CanvasRenderingContext2D,
        cx: number,
        cy: number,
        vecX: number,
        vecY: number,
    ) {
        const rawRad = Math.atan2(vecY, vecX); // rango -π a π
        const deg = rawRad * (180 / Math.PI);
        const rounded = Math.round(deg * 10) / 10;
        const degStr = Number.isInteger(rounded)
            ? rounded.toString()
            : rounded.toFixed(1);

        const radius = 20;
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, -rawRad, rawRad > 0);
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.closePath();

        const mid = rawRad / 2;
        const textX = cx + (radius + 15) * Math.cos(mid);
        const textY = cy + (radius + 15) * Math.sin(mid) * -1;
        ctx.fillStyle = this.color;
        ctx.font = '12px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(
            `${rounded >= 0 ? '' : '-'}${Math.abs(Number(degStr)).toFixed(1)}°`,
            textX,
            textY,
        );
    }

    update(deltaTime: number): void {
        if (deltaTime === 0) return;

        // 1) Aplica la física primero
        this.position.x +=
            this.velocity.x * deltaTime +
            0.5 * this.acceleration.x * deltaTime * deltaTime;
        this.position.y +=
            this.velocity.y * deltaTime +
            0.5 * this.acceleration.y * deltaTime * deltaTime;
        this.velocity.x += this.acceleration.x * deltaTime;
        this.velocity.y += this.acceleration.y * deltaTime;

        // 2) Luego guardamos snapshot (copy) de la posición actual
        // Opcional: reducir puntos guardando solo si se movió lo suficiente (mejora rendimiento)
        // const last = this.trajectory[this.trajectory.length - 1];
        // const dx = this.position.x - last.x;
        // const dy = this.position.y - last.y;
        // const THRESHOLD_SQ = 0.01; // ajustar según escala
        // if (dx*dx + dy*dy > THRESHOLD_SQ) this.trajectory.push(this.position.copy());
        this.trajectory.push(this.position.copy());

        if (this.trajectory.length > 1000) this.trajectory.shift();
    }

    draw(ctx: CanvasRenderingContext2D, borderColor?: string): void {
        const plane = usePlaneStore.getState();
        const { width, height } = ctx.canvas;
        const eX = (this.position.x + plane.position.x) * plane.scale;
        const eY = (this.position.y + plane.position.y) * plane.scale * -1;
        const eRadius = this.radius * plane.scale;

        if (
            eX + eRadius < 0 ||
            eX - eRadius > width ||
            eY + eRadius < 0 ||
            eY - eRadius > height
        )
            return;

        ctx.beginPath();
        if (borderColor) {
            ctx.strokeStyle = borderColor;
            ctx.lineWidth = 2;
            ctx.lineJoin = 'round';
        }
        const corner = eRadius * 0.15;
        if (this.shape === 'circle') {
            ctx.arc(eX, eY, eRadius, 0, 2 * Math.PI);
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
        } else {
            const p1 = [eX, eY - eRadius];
            const p2 = [eX + eRadius, eY + eRadius];
            const p3 = [eX - eRadius, eY + eRadius];
            const compute = (a: number[], b: number[]) => {
                const d = Math.hypot(b[0] - a[0], b[1] - a[1]);
                const r = corner / d;
                return [
                    [a[0] + (b[0] - a[0]) * r, a[1] + (b[1] - a[1]) * r],
                    [b[0] - (b[0] - a[0]) * r, b[1] - (b[1] - a[1]) * r],
                ];
            };
            const [s12, e12] = compute(p1, p2);
            const [s23, e23] = compute(p2, p3);
            const [s31, e31] = compute(p3, p1);
            ctx.moveTo(s12[0], s12[1]);
            ctx.lineTo(e12[0], e12[1]);
            ctx.arcTo(p2[0], p2[1], s23[0], s23[1], corner);
            ctx.lineTo(e23[0], e23[1]);
            ctx.arcTo(p3[0], p3[1], s31[0], s31[1], corner);
            ctx.lineTo(e31[0], e31[1]);
            ctx.arcTo(p1[0], p1[1], s12[0], s12[1], corner);
            ctx.closePath();
        }
        ctx.fillStyle = this.color;
        ctx.fill();
        if (borderColor) ctx.stroke();
    }

    drawTrajectory(ctx: CanvasRenderingContext2D): void {
        if (this.trajectory.length === 0) return;
        const plane = usePlaneStore.getState();

        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle = this.color;
        ctx.globalAlpha = 0.6;
        ctx.lineWidth = 1;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';

        const first = this.trajectory[0];
        let x = (first.x + plane.position.x) * plane.scale;
        let y = (first.y + plane.position.y) * plane.scale * -1;
        ctx.moveTo(x, y);

        for (let i = 1; i < this.trajectory.length; i++) {
            const p = this.trajectory[i];
            x = (p.x + plane.position.x) * plane.scale;
            y = (p.y + plane.position.y) * plane.scale * -1;
            ctx.lineTo(x, y);
        }
        ctx.stroke();
        ctx.closePath();
        ctx.restore();
    }

    resetTrajectory(): void {
        this.trajectory = [this.position.copy()];
    }

    drawPositionVectorResultant(ctx: CanvasRenderingContext2D): void {
        const plane = usePlaneStore.getState();
        const fromX = plane.position.x * plane.scale;
        const fromY = plane.position.y * plane.scale * -1;
        const toX = (this.position.x + plane.position.x) * plane.scale;
        const toY = (this.position.y + plane.position.y) * plane.scale * -1;
        ctx.strokeStyle = this.color;
        ctx.fillStyle = this.color;
        this.drawArrow(ctx, fromX, fromY, toX, toY, 2);
    }

    drawPositionVectorComponents(ctx: CanvasRenderingContext2D): void {
        const plane = usePlaneStore.getState();
        const fromX = plane.position.x * plane.scale;
        const fromY = plane.position.y * plane.scale * -1;
        const toX = (this.position.x + plane.position.x) * plane.scale;
        const toY = (this.position.y + plane.position.y) * plane.scale * -1;
        ctx.strokeStyle = this.color;
        ctx.fillStyle = this.color;
        this.drawArrow(ctx, fromX, fromY, toX, fromY, 1);
        this.drawArrow(ctx, fromX, fromY, fromX, toY, 1);
    }

    drawPositionVectorAngle(ctx: CanvasRenderingContext2D): void {
        const plane = usePlaneStore.getState();
        const cx = plane.position.x * plane.scale;
        const cy = plane.position.y * plane.scale * -1;
        this.drawAngle(
            ctx,
            cx,
            cy,
            this.position.x * plane.scale,
            this.position.y * plane.scale,
        );
    }

    drawVelocityVectorResultant(ctx: CanvasRenderingContext2D): void {
        const plane = usePlaneStore.getState();
        const sx = (this.position.x + plane.position.x) * plane.scale;
        const sy = (this.position.y + plane.position.y) * plane.scale * -1;
        const ex = sx + this.velocity.x * plane.scale;
        const ey = sy + this.velocity.y * plane.scale * -1;
        ctx.strokeStyle = this.color;
        ctx.fillStyle = this.color;
        this.drawArrow(ctx, sx, sy, ex, ey, 2);
    }

    drawVelocityVectorComponents(ctx: CanvasRenderingContext2D): void {
        const plane = usePlaneStore.getState();
        const sx = (this.position.x + plane.position.x) * plane.scale;
        const sy = (this.position.y + plane.position.y) * plane.scale * -1;
        const ex = sx + this.velocity.x * plane.scale;
        const ey = sy + this.velocity.y * plane.scale * -1;
        ctx.strokeStyle = this.color;
        ctx.fillStyle = this.color;
        this.drawArrow(ctx, sx, sy, ex, sy, 1);
        this.drawArrow(ctx, sx, sy, sx, ey, 1);
    }

    drawVelocityVectorAngle(ctx: CanvasRenderingContext2D): void {
        const plane = usePlaneStore.getState();
        const cx = (this.position.x + plane.position.x) * plane.scale;
        const cy = (this.position.y + plane.position.y) * plane.scale * -1;
        this.drawAngle(
            ctx,
            cx,
            cy,
            this.velocity.x * plane.scale,
            this.velocity.y * plane.scale,
        );
    }

    drawAccelerationVectorResultant(ctx: CanvasRenderingContext2D): void {
        const plane = usePlaneStore.getState();
        const sx = (this.position.x + plane.position.x) * plane.scale;
        const sy = (this.position.y + plane.position.y) * plane.scale * -1;
        const ex = sx + this.acceleration.x * plane.scale;
        const ey = sy + this.acceleration.y * plane.scale * -1;
        ctx.strokeStyle = this.color;
        ctx.fillStyle = this.color;
        this.drawArrow(ctx, sx, sy, ex, ey, 2);
    }

    drawAccelerationVectorComponents(ctx: CanvasRenderingContext2D): void {
        const plane = usePlaneStore.getState();
        const sx = (this.position.x + plane.position.x) * plane.scale;
        const sy = (this.position.y + plane.position.y) * plane.scale * -1;
        const ex = sx + this.acceleration.x * plane.scale;
        const ey = sy + this.acceleration.y * plane.scale * -1;
        ctx.strokeStyle = this.color;
        ctx.fillStyle = this.color;
        this.drawArrow(ctx, sx, sy, ex, sy, 1);
        this.drawArrow(ctx, sx, sy, sx, ey, 1);
    }

    drawAccelerationVectorAngle(ctx: CanvasRenderingContext2D): void {
        const plane = usePlaneStore.getState();
        const cx = (this.position.x + plane.position.x) * plane.scale;
        const cy = (this.position.y + plane.position.y) * plane.scale * -1;
        this.drawAngle(
            ctx,
            cx,
            cy,
            this.acceleration.x * plane.scale,
            this.acceleration.y * plane.scale,
        );
    }

    toString(): string {
        return `Movil { position: (${this.position.x.toFixed(
            2,
        )}, ${this.position.y.toFixed(
            2,
        )}), velocity: (${this.velocity.x.toFixed(
            2,
        )}, ${this.velocity.y.toFixed(
            2,
        )}), acceleration: (${this.acceleration.x.toFixed(
            2,
        )}, ${this.acceleration.y.toFixed(2)}) }`;
    }

    getDebugInfo(): string {
        return `Posición: (${this.position.x.toFixed(
            2,
        )}, ${this.position.y.toFixed(
            2,
        )})\nVelocidad: (${this.velocity.x.toFixed(
            2,
        )}, ${this.velocity.y.toFixed(
            2,
        )})\nAceleración: (${this.acceleration.x.toFixed(
            2,
        )}, ${this.acceleration.y.toFixed(2)})\nRadio: ${this.radius}\nForma: ${
            this.shape
        }\nColor: ${this.color}`;
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
