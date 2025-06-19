import { Assets, Sprite, type Application, Text } from 'pixi.js';
import { Movil } from '@/components/simulators/mru/entities/Movil';
import { Vector1D } from '@/lib/physicsUtils';
import { addMountains } from '@/components/simulators/mru/functions/mountains';

const movil = new Movil(new Vector1D(-1000), new Vector1D(0), new Vector1D(1));

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
    addMountains(app);
    // add text
    const FPSText = new Text('FPS: ' + app.ticker.FPS.toFixed(2), {
        fontFamily: 'Arial',
        fontSize: 16,
        fill: 0x00ff00,
        align: 'center',
    });
    const MovilPropsText = new Text('MovilProps: ' + movil.toString() + '\n' + movil.getDebugInfo(), {
        fontFamily: 'Arial',
        fontSize: 16,
        fill: 0x00ff00,
        align: 'center',
    });
    app.stage.addChild(FPSText, MovilPropsText);
    app.ticker.add((time) => {
        movil.update(app.ticker);
        FPSText.text = 'FPS: ' + app.ticker.FPS.toFixed(2) + '\n' + 'Time: ' + time.lastTime.toFixed(2) + ' ms';
        FPSText.x = app.screen.width - FPSText.width - 10;
        FPSText.y = 10;
        MovilPropsText.x = app.screen.width - MovilPropsText.width - 10;
        MovilPropsText.y = 50;
        MovilPropsText.text = 'MovilProps: ' + movil.toString() + '\n' + movil.getDebugInfo();
    });
    app.ticker.start();

}

export { preload, setup, loop };
