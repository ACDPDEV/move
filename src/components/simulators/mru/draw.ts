import { Assets, Sprite, type Application, type Ticker } from 'pixi.js';
import { Movil, MovilInterface } from '@/lib/physicsUtils';
import { Vector1D } from '@/lib/physicsUtils';

async function preload() {
}
async function setup(app: Application, canvas: HTMLCanvasElement, container: HTMLDivElement) {
    await app.init({
        preference: "webgpu",
        backgroundColor: "#333",
        canvas: canvas,
        resizeTo: container,
    });
    const movil = Movil(Vector1D(0), Vector1D(0), Vector1D(0));
};
function loop(app: Application, time: Ticker) {

}

export { preload, setup, loop };