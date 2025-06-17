interface Vector1DInterface {
    x: number;
    add(vector: Vector1D): void;
    sub(vector: Vector1D): void;
    mul(vector: Vector1D): void;
    div(vector: Vector1D): void;
    mag(): number;
    normalize(): void;
    scale(scale: number): void;
    setMag(mag: number): void;
    invert(): void;
    copy(): Vector1D;
    toString(type?: "object" | "tuple" | "objectWithLabel"): string;
}

class Vector1D implements Vector1DInterface {
    x: number;

    constructor(x: number) {
        this.x = x;
    }

    add(vector: Vector1D): void {
        this.x += vector.x;
    }

    sub(vector: Vector1D): void {
        this.x -= vector.x;
    }

    mul(vector: Vector1D): void {
        this.x *= vector.x;
    }

    div(vector: Vector1D): void {
        if (vector.x === 0) {
            throw new Error("Division by zero");
        }
        this.x /= vector.x;
    }

    mag(): number {
        return Math.abs(this.x);
    }

    normalize(): void {
        const mag = this.mag();
        if (mag === 0) {
            throw new Error("Cannot normalize a zero vector");
        }
        this.x = this.x >= 0 ? 1 : -1;
    }

    scale(scale: number): void {
        this.x *= scale;
    }

    setMag(mag: number): void {
        if (this.x === 0) {
            throw new Error("Cannot set magnitude of a zero vector");
        }
        this.x = this.x >= 0 ? mag : -mag;
    }

    invert(): void {
        this.x *= -1;
    }

    copy(): Vector1D {
        return new Vector1D(this.x);
    }

    toString(type: "object" | "tuple" | "objectWithLabel" = "object"): string {
        if (type === "object") {
            return `{x: ${this.x}}`;
        }
        if (type === "tuple") {
            return `(${this.x})`;
        }
        if (type === "objectWithLabel") {
            return `Vector1D {x: ${this.x}}`;
        }
        throw new Error("Invalid type");
    }

    // ✅ Métodos estáticos fuera de la interface
    static add(vectors: Vector1D[]): Vector1D {
        if (vectors.length === 0) throw new Error("No vectors provided");
        const result = vectors[0].copy();
        for (let i = 1; i < vectors.length; i++) {
            result.add(vectors[i]);
        }
        return result;
    }

    static sub(vectors: Vector1D[]): Vector1D {
        if (vectors.length === 0) throw new Error("No vectors provided");
        const result = vectors[0].copy();
        for (let i = 1; i < vectors.length; i++) {
            result.sub(vectors[i]);
        }
        return result;
    }

    static mul(vectors: Vector1D[]): Vector1D {
        if (vectors.length === 0) throw new Error("No vectors provided");
        const result = vectors[0].copy();
        for (let i = 1; i < vectors.length; i++) {
            result.mul(vectors[i]);
        }
        return result;
    }

    static div(vectors: Vector1D[]): Vector1D {
        if (vectors.length === 0) throw new Error("No vectors provided");
        const result = vectors[0].copy();
        for (let i = 1; i < vectors.length; i++) {
            if (vectors[i].x === 0) {
                throw new Error("Division by zero");
            }
            result.div(vectors[i]);
        }
        return result;
    }

    static distance(vector1: Vector1D, vector2: Vector1D): number {
        return Math.abs(vector1.x - vector2.x);
    }

    static fromMag(mag: number, direction: boolean): Vector1D {
        direction ? x = mag : -mag;
        return new Vector1D(x);
    }
}

export default Vector1D;