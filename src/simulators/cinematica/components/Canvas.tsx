import {useEffect } from 'preact/hooks'
import type { JSX } from 'preact/jsx-runtime'
import { useSimulation } from '@/simulators/cinematica/context/SimulationContext'
import { CANVAS_CONFIG } from '@/simulators/cinematica/utils/canvasManagment'
import { runTicker } from '@/simulators/cinematica/utils/timeManagment'
import { drawPlane, clearCanvas, drawEntities } from '@/simulators/cinematica/utils/drawingOnCanvas'
import { useInitialRefs } from '@/simulators/cinematica/hooks/useInitialRefs'
import { listenEvents } from '@/simulators/cinematica/utils/canvasListeners'

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
            timePrediction
        },
        updateIsReset,
        updateIsInputTimeChanged,
        updateFPS,
        updateTime,
        updatePlane,
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
                Ticker,
                time,
                speed,
                isPlaying,
                isReset,
                isInputTimeChanged,
                updateFPS,
                updateTime,
                updateIsReset,
                updateIsInputTimeChanged
            );

            clearCanvas($canvas);
            drawPlane($canvas, AbsolutePlane, CANVAS_CONFIG);
            drawEntities(ctx, entities, AbsolutePlane, Ticker, showVectors, isPlaying);
            
            animationFrameId = window.requestAnimationFrame(render)
        }
        render()
        
        return () => {
            window.cancelAnimationFrame(animationFrameId);
            cleanupEvents();
        }
    }, [
        isPlaying,
        timePrediction,
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
