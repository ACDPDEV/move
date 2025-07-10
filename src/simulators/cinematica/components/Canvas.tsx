import {useEffect } from 'preact/hooks'
import type { JSX } from 'preact/jsx-runtime'
import { useSimulation } from '@/simulators/cinematica/context/SimulationContext'
import { CANVAS_CONFIG } from '@/simulators/cinematica/utils/canvasManagment'
import { runTicker } from '@/simulators/cinematica/utils/timeManagment'
import { drawGrid, drawAxes, clearCanvas, drawEntities } from '@/simulators/cinematica/utils/drawingOnCanvas'
import { useInitialRefs } from '@/simulators/cinematica/hooks/useInitialRefs'
import { listenEvents } from '@/simulators/cinematica/utils/canvasListeners'

function Canvas(
    { style }: {
        style?: JSX.CSSProperties
    }
) {
  
    const { 
        state: { isPlaying, entities, speed, showVectors },
        updateFPS, updateTime 
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
        
        const cleanupEvents = listenEvents(canvasRef.current!, MouseRef.current!, AbsolutePlaneRef.current!, CANVAS_CONFIG);

        const render = () => {
            runTicker(Ticker, speed, isPlaying, updateFPS, updateTime);

            clearCanvas(ctx, $canvas);
            drawGrid(ctx, $canvas, AbsolutePlane, CANVAS_CONFIG);
            drawAxes(ctx, $canvas, AbsolutePlane);
            drawEntities(ctx, entities, AbsolutePlane, Ticker, showVectors, isPlaying);
            
            animationFrameId = window.requestAnimationFrame(render)
        }
        render()
        
        return () => {
            cleanupEvents();
        }
    }, [isPlaying, speed, entities, updateFPS, updateTime, showVectors])
    
    return <canvas ref={canvasRef} style={style} />
}

export default Canvas
