import type { Ticker } from '@/simulations/cinematica/types';
import type { Movil } from '../entities/Movil';

function runTicker(
    time: number,
    ticker: Ticker,
    speed: number,
    isPlaying: boolean,
    isReset: boolean,
    isInputTimeChanged: boolean,
    movementPrediction: boolean,
    entities: Movil[],
    updateFPS: (fps: number) => void,
    updateTime: (time: number) => void,
    updateIsReset: (isReset: boolean) => void,
    updateIsInputTimeChanged: (isInputTimeChanged: boolean) => void,
) {
    if (isReset) {
        const deltaTimeChanged = -ticker.timeCount * 1000 * speed;
        entities.forEach(entity => entity.update(deltaTimeChanged));
        ticker.timeCount = 0;
        ticker.lastTime = performance.now();
        ticker.frameCount = 0;
        ticker.fps = 0;
        updateIsReset(false);
    }
    if (isInputTimeChanged) {
        if (movementPrediction) {
            const deltaTimeChanged = (time - ticker.timeCount) * 1000 * speed;
            entities.forEach(entity => {
                entity.update(deltaTimeChanged);
            });
        }
        
        ticker.timeCount = time
        updateIsInputTimeChanged(false);
    }

    const now = performance.now();
    ticker.deltaTime = now - (ticker.lastTime || now - 1000/60);
    ticker.lastTime = now;
    
    ticker.fps = Math.round(1000 / (ticker.deltaTime || 1000/60));
    ticker.frameCount++;
    ticker.lastFpsUpdate = now;
    
    
    if (isPlaying) {
        ticker.timeCount += ticker.deltaTime / 1000 * speed;
        updateTime(ticker.timeCount);   
    
    }
    if (ticker.frameCount % 60 === 0) {
        updateFPS(ticker.fps);
    }
}

export {
    runTicker
}