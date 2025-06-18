import { Vector1D } from "@/lib/physicsUtils";

class Movil  {
    position: Vector1D;
    velocity: Vector1D;
    acceleration: Vector1D;

    constructor(position: Vector1D, velocity: Vector1D, acceleration: Vector1D) {
        this.position = position;
        this.velocity = velocity;
        this.acceleration = acceleration;
    }

    update(deltaTime: number): void {
        this.position.add(
            this.velocity.add(
                this.acceleration.copy().scale(deltaTime/60 /* pixel/frame a pixel/s */)
            )
        )
    }
    
    toString(): string {
        return `Movil {position: ${this.position.x.toFixed(2)}, velocity: ${this.velocity.x.toFixed(2)}, acceleration: ${this.acceleration.x.toFixed(2)}}`
    }
}

export { Movil };
