import { useEffect, useCallback } from 'preact/hooks'
import type { JSX } from 'preact/jsx-runtime'
import { useSimulation } from '@/simulations/cinematica/context/SimulationContext'
import { CANVAS_CONFIG } from '@/simulations/cinematica/utils/canvasManagment'
import { runTicker } from '@/simulations/cinematica/utils/timeManagment'
import { drawPlane, clearCanvas, drawEntities } from '@/simulations/cinematica/utils/drawingOnCanvas'
import { useInitialRefs } from '@/simulations/cinematica/hooks/useInitialRefs'
import { listenEvents } from '@/simulations/cinematica/utils/canvasListeners'

function Canvas(
    { style }: {
        style?: JSX.CSSProperties
    }
) {
    const { 
        state: {
            time,
            isPlaying,
            isReset,
            entities,
            speed,
            showVectors,
            isInputTimeChanged,
            movementPrediction,
        },
        updateIsReset,
        updateIsInputTimeChanged,
        updateFPS,
        updateTime,
        updatePlane,
        pause,
    } = useSimulation();

    const { 
        canvasRef, 
        TickerRef, 
        MouseRef, 
        AbsolutePlaneRef 
    } = useInitialRefs();

    useEffect(() => {
        
        const $canvas = canvasRef.current!
        const ctx = $canvas.getContext('2d')!
        let animationFrameId: number
        
        const Ticker = TickerRef.current;
        const Mouse = MouseRef.current;
        const AbsolutePlane = AbsolutePlaneRef.current;
        
        const cleanupEvents = listenEvents(
            $canvas,
            Mouse,
            AbsolutePlane,
            CANVAS_CONFIG,
            updatePlane,
        );

        const render = () => {
            runTicker(
                time,
                Ticker,
                speed,
                isPlaying,
                isReset,
                isInputTimeChanged,
                movementPrediction,
                entities,
                updateFPS,
                updateTime,
                updateIsReset,
                updateIsInputTimeChanged,
            );

            clearCanvas($canvas);
            drawPlane($canvas, AbsolutePlane, CANVAS_CONFIG);
            drawEntities(ctx, entities, AbsolutePlane, Ticker, speed, showVectors, isPlaying);
            
            animationFrameId = window.requestAnimationFrame(render)
        }
        render()
        
        return () => {
            window.cancelAnimationFrame(animationFrameId);
            cleanupEvents();
        }
    }, [
        isPlaying,
        movementPrediction,
        isReset,
        isInputTimeChanged,
        showVectors,
        entities,
        speed,
        updateFPS,
        updateTime,
        updateIsReset,
        canvasRef,
    ])
    
    return <canvas ref={canvasRef} style={style} />
}

export default Canvas
