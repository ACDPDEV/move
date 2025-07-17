function resizeCanvas($canvas: HTMLCanvasElement): void {
  const { width, height } = $canvas.getBoundingClientRect();
  const ratio = window.devicePixelRatio || 1;

  if ($canvas.width !== width * ratio || $canvas.height !== height * ratio) {
    $canvas.width = width * ratio;
    $canvas.height = height * ratio;
    const ctx = $canvas.getContext('2d');
    ctx?.setTransform(1, 0, 0, 1, 0, 0);
    ctx?.scale(ratio, ratio);
  }
}

const CANVAS_CONFIG = {
    MIN_SCALE: 0.1,
    MAX_SCALE: 10,
    GRID_SIZE: 100,
    ZOOM_SENSITIVITY: 0.001,
    MAX_GRID_LINES: 50
};

export {
  resizeCanvas,
  CANVAS_CONFIG,
};