import { Vector1D } from "@/lib/physicsUtils";

interface MovilInterface {
    position: Vector1D;
    velocity: Vector1D;
    acceleration: Vector1D;
}

class Movil implements MovilInterface {
    position: Vector1D;
    velocity: Vector1D;
    acceleration: Vector1D;

    constructor(position: Vector1D, velocity: Vector1D, acceleration: Vector1D): MovilInterface {
        this.position = position;
        this.velocity = velocity;
        this.acceleration = acceleration;
    }

    
}

import { Movil, MovilInterface } from "@/components/simulators/mru/entities/Movil";