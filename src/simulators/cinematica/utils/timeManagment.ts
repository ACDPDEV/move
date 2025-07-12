import type { Ticker } from '@/simulators/cinematica/types';

function runTicker(
    ticker: Ticker,
    speed: number,
    isPlaying: boolean,
    isReset: boolean,
    inputTimeChanged: number,
    movementPrediction: boolean,
    entities: any[],
    updateFPS: (fps: number) => void,
    updateTime: (time: number) => void,
    updateIsReset: (isReset: boolean) => void,
    updateInputTimeChanged: (isInputTimeChanged: number) => void,
) {
    if (isReset) {
        ticker.timeCount = 0;
        ticker.lastTime = performance.now();
        ticker.frameCount = 0;
        ticker.fps = 0;
        updateIsReset(false);
    }
    if (inputTimeChanged !== 0) {
        if (movementPrediction) {
            const deltaTimeChange = inputTimeChanged - ticker.timeCount;
            ticker.timeCount = inputTimeChanged;
            entities.forEach(entity => {
                entity.update(deltaTimeChange);
            });
        }
        const deltaTimeChange = inputTimeChanged - ticker.timeCount;
        
        ticker.timeCount = inputTimeChanged;
        updateInputTimeChanged(0);
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