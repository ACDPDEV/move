class Vector2D {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    add(vector: Vector2D): Vector2D {
        this.x += vector.x;
        this.y += vector.y;
        return this;
    }

    sub(vector: Vector2D): Vector2D {
        this.x -= vector.x;
        this.y -= vector.y;
        return this;
    }

    mul(vector: Vector2D): Vector2D {
        this.x *= vector.x;
        this.y *= vector.y;
        return this;
    }

    div(vector: Vector2D): Vector2D {
        if (vector.x === 0 || vector.y === 0) {
            throw new Error("Division by zero");
        }
        this.x /= vector.x;
        this.y /= vector.y;
        return this;
    }

    mag(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    normalize(): Vector2D {
        const mag = this.mag();
        if (mag === 0) {
            throw new Error("Cannot normalize a zero vector");
        }
        this.x /= mag;
        this.y /= mag;
        return this;
    }

    scale(scale: number): Vector2D {
        this.x *= scale;
        this.y *= scale;
        return this;
    }

    setMag(mag: number): Vector2D {
        if (this.x === 0 && this.y === 0) {
            throw new Error("Cannot set magnitude of a zero vector");
        }
        this.normalize();
        this.scale(mag);
        return this;
    }
    
    angle(): number {
        if (this.x === 0 && this.y === 0) return 0; 
        return Math.atan2(this.y, this.x);
    }

    rotate(angle: number): Vector2D {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        const newX = this.x * cos - this.y * sin;
        const newY = this.x * sin + this.y * cos;
        this.x = newX;
        this.y = newY;
        return this;
    }

    invert(): Vector2D {
        this.x *= -1;
        this.y *= -1;
        return this;
    }

    invertX(): Vector2D {
        this.x *= -1;
        return this;
    }

    invertY(): Vector2D {
        this.y *= -1;
        return this;
    }

    copy(): Vector2D {
        return new Vector2D(this.x, this.y);
    }

    toString(
        type: "object" | "tuple" | "objectWithLabel" = "object"
    ): string {
        if (type === "object") {
            return `{x: ${this.x}, y: ${this.y}}`;
        }
        if (type === "tuple") {
            return `(${this.x}, ${this.y})`;
        }
        if (type === "objectWithLabel") {
            return `Vector2D {x: ${this.x}, y: ${this.y}}`;
        }
        throw new Error("Invalid type");
    }

    static add(vectors: Vector2D[]): Vector2D {
        if (vectors.length === 0) throw new Error("No vectors provided");
        const result = vectors[0].copy();
        for (let i = 1; i < vectors.length; i++) {
            result.add(vectors[i]);
        }
        return result;
    }

    static sub(vectors: Vector2D[]): Vector2D {
        if (vectors.length === 0) throw new Error("No vectors provided");
        const result = vectors[0].copy();
        for (let i = 1; i < vectors.length; i++) {
            result.sub(vectors[i]);
        }
        return result;
    }

    static mul(vectors: Vector2D[]): Vector2D {
        if (vectors.length === 0) throw new Error("No vectors provided");
        const result = vectors[0].copy();
        for (let i = 1; i < vectors.length; i++) {
            result.mul(vectors[i]);
        }
        return result;
    }

    static div(vectors: Vector2D[]): Vector2D {
        if (vectors.length === 0) throw new Error("No vectors provided");
        const result = vectors[0].copy();
        for (let i = 1; i < vectors.length; i++) {
            if (vectors[i].x === 0 || vectors[i].y === 0) {
                throw new Error("Division by zero");
            }
            result.div(vectors[i]);
        }
        return result;
    }

    static angleBetween(vector1: Vector2D, vector2: Vector2D): number {
        const mag1 = vector1.mag();
        const mag2 = vector2.mag();
        
        if (mag1 === 0 || mag2 === 0) throw new Error("Cannot calculate angle between zero vectors");
        
        const dot = Vector2D.dot(vector1, vector2);
        const cosAngle = dot / (mag1 * mag2);
        
        const clampedCos = Math.max(-1, Math.min(1, cosAngle));
        return Math.acos(clampedCos);
    }

    static dot(vector1: Vector2D, vector2: Vector2D): number {
        return vector1.x * vector2.x + vector1.y * vector2.y;
    }

    static cross(vector1: Vector2D, vector2: Vector2D): number {
        return vector1.x * vector2.y - vector1.y * vector2.x;
    }

    static distance(vector1: Vector2D, vector2: Vector2D): number {
        const dx = vector1.x - vector2.x;
        const dy = vector1.y - vector2.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    static fromAngleAndMag(angle: number, mag: number): Vector2D {
        return new Vector2D(Math.cos(angle) * mag, Math.sin(angle) * mag);
    }
}

export default Vector2D;