import type { Ticker } from '@/simulators/cinematica/types';

function runTicker(
    ticker: Ticker,
    speed: number,
    isPlaying: boolean,
    updateFPS: (fps: number) => void,
    updateTime: (time: number) => void,
) {
    const now = performance.now();
    ticker.deltaMS = now - (ticker.lastTime || now - 16);
    ticker.lastTime = now;
    
    ticker.frameCount++;
    if (now - ticker.lastFpsUpdate > 1000) {
        ticker.fps = Math.round((ticker.frameCount * 1000) / (now - ticker.lastFpsUpdate));
        ticker.frameCount = 0;
        ticker.lastFpsUpdate = now;
    }
    
    ticker.deltaTime = 60 / ticker.fps * speed;

    if (isPlaying) {
        ticker.timeCount += ticker.deltaMS / 1000 * speed;
        updateTime(ticker.timeCount);
    }
    updateFPS(ticker.fps);
}

export {
    runTicker
}