import { useRef, useEffect } from 'preact/hooks'

function useCanvas (draw: (ctx: CanvasRenderingContext2D, frameCount: number) => void) {
  
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  useEffect(() => {
    
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    let frameCount = 0
    let animationFrameId: number
    
    const render = () => {
      frameCount++
      draw(ctx, frameCount)
      animationFrameId = window.requestAnimationFrame(render)
    }
    render()
    
    return () => {
      window.cancelAnimationFrame(animationFrameId)
    }
  }, [draw])
  
  return canvasRef
}

export default useCanvas