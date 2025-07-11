import type { Ticker } from '@/simulators/cinematica/types';

function runTicker(
    ticker: Ticker,
    time: number,
    speed: number,
    isPlaying: boolean,
    isReset: boolean,
    isInputTimeChanged: boolean,
    updateFPS: (fps: number) => void,
    updateTime: (time: number) => void,
    updateIsReset: (isReset: boolean) => void,
    updateIsInputTimeChanged: (isInputTimeChanged: boolean) => void,
) {
    if (isReset) {
        ticker.timeCount = 0;
        ticker.lastTime = performance.now();
        ticker.frameCount = 0;
        ticker.fps = 0;
        updateIsReset(false);
    }
    if (isInputTimeChanged) {
        ticker.timeCount = time;
        updateIsInputTimeChanged(false);
    }

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