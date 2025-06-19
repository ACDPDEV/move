import { Vector1D } from "@/lib/physicsUtils";
import type { Application, Ticker } from "pixi.js";
class Movil  {
    position: Vector1D;
    velocity: Vector1D;
    acceleration: Vector1D;
    private initialPosition: Vector1D;
    private initialVelocity: Vector1D;
    constructor(position: Vector1D, velocity: Vector1D, acceleration: Vector1D) {
        this.position = position;
        this.velocity = velocity;
        this.acceleration = acceleration;
        this.initialPosition = position.copy();
        this.initialVelocity = velocity.copy();
    }
    update(ticker: Ticker): void {
        /* Enfoque 1: Fórmulas de MRUV usando tiempo con iniciales a  */
        this.velocity = this.initialVelocity.copy().add(this.acceleration.copy().scale(ticker.lastTime/1000));
        this.position = this.initialPosition.copy().add(this.velocity.copy().scale(1/2*(ticker.lastTime/1000)**2));
        /* Enfoque 2: Usando el bucle con deltaTime */
        // this.position.add(
        //     this.velocity.add(
        //         this.acceleration.copy().scale(ticker.deltaTime/60 / pixel/frame a pixel/s */)
        //     )
        // )
    }
    draw(app: Application): void {
       
    }
   
    toString(): string {
        return `Movil {position: ${this.position.x.toFixed(2)}, velocity: ${this.velocity.x.toFixed(2)}, acceleration: ${this.acceleration.x.toFixed(2)}}`;
    }

    getDebugInfo(): string {
        return `
        
        `
    }
}
export { Movil };