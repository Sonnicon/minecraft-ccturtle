class Turtle {
    #id
    #x
    #z
    #y
    // 0 - North (-z), 1 - East (+x), 2 - South (+z), 3 - West (-x)
    #rotation

    static turtles = {}

    constructor(id, x, z, y, rotation){
        this.#id = id
        this.#x = x
        this.#z = z
        this.#y = y
        this.#rotation = rotation

        Turtle.turtles[id] = this
    }

    setLocation(obj){
        this.#x = obj.x
        this.#z = obj.z
        this.#y = obj.y
        this.#rotation = obj.rotation
    }

    setRotation(rotation){
        this.#rotation = (rotation % 4 + 4) % 4
    }

    moveForward(){
        this.moveBy(this.#rotation % 2 * (2 - this.#rotation), (this.#rotation + 1) % 2 * (this.#rotation - 1), 0)
    }

    moveUp(){
        this.moveBy(0, 0, 1)
    }

    moveDown(){
        this.moveBy(0, 0, -1)
    }

    moveBy(x, z, y){
        var data = JSON.stringify({"type": "moveBy", "value": {"id": this.#id, "x": x, "z": z, "y": y}})
        send(data)
    }

    movedBy(obj){
        this.#x += obj.x
        this.#z += obj.z
        this.#y += obj.y
    }
}