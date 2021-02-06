class Turtle {
    #id
    #x
    #z
    #y
    // 0 - North (-z), 1 - East (+x), 2 - South (+z), 3 - West (-x)
    #rotation
    #box

    static turtles = {}

    constructor(id, x, z, y, rotation){
        this.#id = id
        this.#box = graphicsAddTurtle()
        this.setLocation(x, z, y, rotation)

        Turtle.turtles[id] = this
    }

    setLocation(obj){
        this.setLocation(obj.x, obj.y, obj.z)
    }

    setLocation(x, z, y, rotation){
        this.#x = x
        this.#z = z
        this.#y = y
        this.#box.position.set(x, y, z)
        this.setRotation(rotation)
        render()
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
        var data = JSON.stringify({"type": "moveBy", "id": this.#id, "value": {"x": x, "z": z, "y": y}})
        send(data)
    }

    movedBy(obj){
        this.#x += obj.x
        this.#z += obj.z
        this.#y += obj.y
        this.#box.translate(obj.x, obj.y, obj.z)
        render()
    }

    remove(){
        this.#box.dispose()
        delete Turtle.turtles[this.#id]
    }
}