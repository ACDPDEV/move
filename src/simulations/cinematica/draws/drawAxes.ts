import { usePlaneStore } from '../stores/usePlaneStore';

function drawAxes(ctx: CanvasRenderingContext2D, dark: boolean): void {
    const plane = usePlaneStore.getState();
    const [pX, pY] = [
        plane.position.x * plane.scale,
        plane.position.y * plane.scale * -1,
    ];
    const { width, height } = ctx.canvas;
    // Eje X
    if (pY >= 0 && pY <= height) {
        ctx.beginPath();
        ctx.moveTo(0, pY);
        ctx.lineTo(width, pY);
        ctx.strokeStyle = dark ? '#D3DFD8' : '#000';
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.closePath();
    }

    // Eje Y
    if (pX >= 0 && pX <= width) {
        ctx.beginPath();
        ctx.moveTo(pX, 0);
        ctx.lineTo(pX, height);
        ctx.strokeStyle = dark ? '#D3DFD8' : '#000';
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.closePath();
    }
}

export { drawAxes };
