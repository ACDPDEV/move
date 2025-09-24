import { usePlaneStore } from '@/simulations/cinematica/stores/usePlaneStore';

function drawOriginPoint(ctx: CanvasRenderingContext2D, dark: boolean): void {
    const plane = usePlaneStore.getState();
    const [pX, pY] = [
        plane.position.x * plane.scale,
        plane.position.y * plane.scale * -1,
    ];
    const { width, height } = ctx.canvas;

    if (pX >= 0 && pX <= width && pY >= 0 && pY <= height) {
        ctx.beginPath();
        ctx.strokeStyle = dark ? '#fff' : '#000';
        ctx.lineWidth = 1;
        ctx.arc(pX, pY, 5, 0, Math.PI * 2);
        ctx.stroke();
        ctx.closePath();
    }
}

export { drawOriginPoint };
