import { Assets, Sprite, type Application, Text } from 'pixi.js';
import { Movil } from '@/simulators/mru/entities/Movil';
import { Vector1D } from '@/lib/physicsUtils';
import { addMountains } from '@/simulators/mru/functions/mountains';

interface ApplicationStorage {
    entities: any[]
}

async function preload() {
}
async function setup(app: Application, canvas: HTMLCanvasElement, container: HTMLDivElement) {
    await app.init({
        preference: "webgpu",
        backgroundColor: "#333",
        canvas: canvas,
        resizeTo: container,
        autoStart: false,
        sharedTicker: false,
    });
};
function loop(app: Application, appStorage: ApplicationStorage) {
    const movil = new Movil(new Vector1D(-1000), new Vector1D(0), new Vector1D(1));

    appStorage.entities.push(movil);

    addMountains(app, movil.velocity.x, movil.acceleration.x);

    app.ticker.add((time) => {
        movil.update(app.ticker);
    });
}

export { preload, setup, loop };
