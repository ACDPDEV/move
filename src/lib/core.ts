class Vector2D {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  add(v: Vector2D) {
    this.x += v.x;
    this.y += v.y;
  }

  mult(scalar: number) {
    this.x *= scalar;
    this.y *= scalar;
  }

  copy() {
    return new Vector2D(this.x, this.y);
  }
}

export { Vector2D };
