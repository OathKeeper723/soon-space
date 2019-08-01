interface Coordinate {
  _x: number
  _y: number
  _z: number
}

interface xyz {
  x: number
  y: number
  z: number
}

class Coordinate implements Coordinate {
  get x(): number {
    return this._x
  }
  set x(value: number) {
    this._x = value
  }
  get y(): number {
    return this._y
  }
  set y(value: number) {
    this._y = value
  }
  get z(): number {
    return this._z
  }
  set z(value: number) {
    this._z = value
  }

  constructor(x: number, y: number, z: number) {
    this._x = x
    this._y = y
    this._z = z
  }
  public toAny() {
    const any = []
    any.push(this._x)
    any.push(this._y)
    any.push(this._z)
  }
  public set(obj: xyz){
    this._x = obj.x
    this._y = obj.y
    this._z = obj.z
  }
}

export default Coordinate
