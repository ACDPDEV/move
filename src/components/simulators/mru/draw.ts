import { Assets, Sprite, type Application, type Ticker } from 'pixi.js';
import { Movil } from '@/components/simulators/mru/entities/Movil';
import { Vector1D } from '@/lib/physicsUtils';

const movil = new Movil(new Vector1D(0), new Vector1D(0), new Vector1D(1));

async function preload() {
}
async function setup(app: Application, canvas: HTMLCanvasElement, container: HTMLDivElement) {
    await app.init({
        preference: "webgpu",
        backgroundColor: "#333",
        canvas: canvas,
        resizeTo: container,
        autoStart: true,
        sharedTicker: false,
    });
};
function loop(app: Application) {
    movil.update(app.ticker.deltaTime);
}

export { preload, setup, loop };
