import useCanvas from '@/hooks/useCanvas'

function Canvas (
  { draw, style }: { 
    draw: (ctx: CanvasRenderingContext2D, frameCount: number) => void,
    style?: { [key: string]: string | number }
  }
) {  
  
  const canvasRef = useCanvas(draw)
  
  return <canvas ref={canvasRef} style={style} />
}

export { Canvas }