class Vector1D {
    x: number;

    constructor(x: number) {
        this.x = x;
    }

    add(vector: Vector1D): Vector1D {
        this.x += vector.x;
        return this
    }

    sub(vector: Vector1D): Vector1D {
        this.x -= vector.x;
        return this
    }

    mul(vector: Vector1D): Vector1D {
        this.x *= vector.x;
        return this
    }

    div(vector: Vector1D): Vector1D {
        if (vector.x === 0) {
            throw new Error("Division by zero");
        }
        this.x /= vector.x;
        return this
    }

    mag(): number {
        return Math.abs(this.x);
    }

    normalize(): Vector1D {
        const mag = this.mag();
        if (mag === 0) {
            throw new Error("Cannot normalize a zero vector");
        }
        this.x = this.x >= 0 ? 1 : -1;
        return this
    }

    scale(scale: number): Vector1D {
        this.x *= scale;
        return this
    }

    setMag(mag: number): Vector1D {
        if (this.x === 0) {
            throw new Error("Cannot set magnitude of a zero vector");
        }
        this.x = this.x >= 0 ? mag : -mag;
        return this
    }

    invert(): Vector1D {
        this.x *= -1;
        return this
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
        direction ? mag = -mag : null;
        return new Vector1D(mag);
    }
}

export default Vector1D;