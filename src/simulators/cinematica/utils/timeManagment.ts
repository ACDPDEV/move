import type { Ticker } from '@/simulators/cinematica/types';
import type { Movil } from '../entities/Movil';

function runTicker(
    ticker: Ticker,
    speed: number,
    isPlaying: boolean,
    isReset: boolean,
    inputTimeChanged: number,
    movementPrediction: boolean,
    entities: Movil[],
    updateFPS: (fps: number) => void,
    updateTime: (time: number) => void,
    updateIsReset: (isReset: boolean) => void,
    updateInputTimeChanged: (isInputTimeChanged: number) => void,
    pause: () => void,
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
    if (inputTimeChanged !== 0) {
        if (movementPrediction) {
            const deltaTimeChanged = inputTimeChanged * 1000 * speed;
            console.log('dt', deltaTimeChanged, inputTimeChanged, speed);
            entities.forEach(entity => {
                entity.update(deltaTimeChanged);
                console.log('changed...')
            });
        }
        
        ticker.timeCount += inputTimeChanged
        updateInputTimeChanged(0);
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