function resizeCanvas(canvas: HTMLCanvasElement) {
    const { width, height } = canvas.getBoundingClientRect()
    
    if (canvas.width !== width || canvas.height !== height) {
      const { devicePixelRatio:ratio=1 } = window
      const ctx = canvas.getContext('2d')
      canvas.width = width*ratio
      canvas.height = height*ratio
      ctx?.scale(ratio, ratio)
      return true
    }

    return false
}

export { resizeCanvas };