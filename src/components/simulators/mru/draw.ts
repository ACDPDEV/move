function draw(ctx: CanvasRenderingContext2D, frameCount: number) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    ctx.fillStyle = '#fff'
    ctx.beginPath()
    ctx.arc(50, 100, 20*Math.sin(frameCount*0.05)**2, 0, 2*Math.PI)
    ctx.fill()
    ctx.closePath()
    ctx.stroke()
    ctx.fillStyle = '#fff'
    ctx.font = '20px Arial'
    ctx.textAlign = 'center'
    ctx.fillText(`Frame Count: ${frameCount}`, ctx.canvas.width/2, ctx.canvas.height/2)
    
};

export { draw };