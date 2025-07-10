import {useEffect } from 'preact/hooks'
import type { JSX } from 'preact/jsx-runtime'
import { useSimulation } from '@/simulators/cinematica/context/SimulationContext'
import { CANVAS_CONFIG, resizeCanvas } from '@/simulators/cinematica/utils/canvasManagment'
import { runTicker } from '@/simulators/cinematica/utils/timeManagment'
import { drawGrid, drawAxes } from '@/simulators/cinematica/utils/drawingOnCanvas'
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

        const listenedEvents = listenEvents($canvas, Mouse, AbsolutePlane, CANVAS_CONFIG);        
        console.log('listenedEvents', listenedEvents);
        
        
        

        const render = () => {
            runTicker(Ticker, speed, isPlaying, updateFPS, updateTime);

            ctx.clearRect(0, 0, $canvas.width, $canvas.height);
            
            ctx.fillStyle = 'black';
            ctx.fillRect(0, 0, $canvas.width, $canvas.height);
            
            const absolutePositionWithScale = {
                x: AbsolutePlane.position.x * AbsolutePlane.scale,
                y: AbsolutePlane.position.y * AbsolutePlane.scale,
            };
            
            drawGrid(ctx, $canvas, AbsolutePlane, CANVAS_CONFIG);
            drawAxes(ctx, $canvas, AbsolutePlane);

            entities.forEach(entity => {
                if (isPlaying) {
                    entity.update(Ticker.deltaTime);
                }
                entity.absoluteMoveAndScale(AbsolutePlane.position, AbsolutePlane.scale);
                entity.draw(ctx);
                if (showVectors) {
                    entity.drawVelocityVector(ctx, AbsolutePlane.scale);
                    entity.drawAccelerationVector(ctx, AbsolutePlane.scale);
                }
            });

            animationFrameId = window.requestAnimationFrame(render)
        }
        render()
        
        return () => {

        }
    }, [isPlaying, speed, entities, updateFPS, updateTime, showVectors])
    
    return <canvas ref={canvasRef} style={style} />
}

export default Canvas
