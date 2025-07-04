import { useRef, useEffect } from 'preact/hooks'

function resizeCanvas(canvas: HTMLCanvasElement): void {
  const { width, height } = canvas.getBoundingClientRect();
  const ratio = window.devicePixelRatio || 1;
  // Solo redimensiona si es necesario
  if (canvas.width !== width * ratio || canvas.height !== height * ratio) {
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    const ctx = canvas.getContext('2d');
    ctx?.setTransform(1, 0, 0, 1, 0, 0);
    ctx?.scale(ratio, ratio);
  }
}


function useCanvas(draw: (ctx: CanvasRenderingContext2D, frameCount: number) => void) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let frameCount = 0;
    let animationFrameId: number;

    const handleResize = () => resizeCanvas(canvas);
    handleResize();
    window.addEventListener('resize', handleResize);

    const render = () => {
      frameCount++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      draw(ctx, frameCount);
      animationFrameId = window.requestAnimationFrame(render);
    };
    render();

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [draw]);

  return canvasRef;
}

export default useCanvas