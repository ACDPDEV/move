import { Assets, Sprite, type Application } from 'pixi.js';

async function preload() {
    const assets = [
        { alias: 'background', src: 'https://pixijs.com/assets/tutorials/fish-pond/pond_background.jpg' },
        { alias: 'fish1', src: 'https://pixijs.com/assets/tutorials/fish-pond/fish1.png' },
        { alias: 'fish2', src: 'https://pixijs.com/assets/tutorials/fish-pond/fish2.png' },
        { alias: 'fish3', src: 'https://pixijs.com/assets/tutorials/fish-pond/fish3.png' },
        { alias: 'fish4', src: 'https://pixijs.com/assets/tutorials/fish-pond/fish4.png' },
        { alias: 'fish5', src: 'https://pixijs.com/assets/tutorials/fish-pond/fish5.png' },
        { alias: 'overlay', src: 'https://pixijs.com/assets/tutorials/fish-pond/wave_overlay.png' },
        { alias: 'displacement', src: 'https://pixijs.com/assets/tutorials/fish-pond/displacement_map.png' },
    ];
    await Assets.load(assets);
}
async function setup(app: Application, canvas: HTMLCanvasElement, container: HTMLDivElement) {
    await app.init({
        preference: "webgpu",
        backgroundColor: "#333",
        canvas: canvas,
        resizeTo: container,
    });
};
function loop(app: Application) {
    // Create a background sprite.
  const background = Sprite.from('background');

  // Center background sprite anchor.
  background.anchor.set(0.5);

  /**
   * If the preview is landscape, fill the width of the screen
   * and apply horizontal scale to the vertical scale for a uniform fit.
   */
  if (app.screen.width > app.screen.height) {
    background.width = app.screen.width * 1.2;
    background.scale.y = background.scale.x;
  } else {
    /**
     * If the preview is square or portrait, then fill the height of the screen instead
     * and apply the scaling to the horizontal scale accordingly.
     */
    background.height = app.screen.height * 1.2;
    background.scale.x = background.scale.y;
  }

  // Position the background sprite in the center of the stage.
  background.x = app.screen.width / 2;
  background.y = app.screen.height / 2;

  // Add the background to the stage.
  app.stage.addChild(background);
}

export { preload, setup, loop };