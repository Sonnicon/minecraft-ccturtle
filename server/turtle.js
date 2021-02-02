const main = require("./main")

// todo
class Turtle {
    #id
    #x
    #z
    #y
    // 0 - North (-z), 1 - East (+x), 2 - South (+z), 3 - West (-x)
    #rotation

    static nextid = 0
    static turtles = {}

    constructor(x, z, y, rotation){
        this.#x = x
        this.#z = z
        this.#y = y
        this.#rotation = rotation

        this.#id = Turtle.nextid
        Turtle.turtles[Turtle.nextid] = this
        Turtle.nextid = Turtle.nextid + 1
        this.sendData()
        main.sendTurtle(JSON.stringify({"type": "setPosition", "value": {"x": this.#x, "z": this.#z, "y": this.#y, "rotation": this.#rotation}}))
    }

    sendData(){
        main.sendClient(JSON.stringify({"type": "turtleCreated", "value": {"id": this.#id, "x": this.#x, "z": this.#z, "y": this.#y, "rotation": this.#rotation}}))
    }

    setLocation(obj){
        this.#x = obj.x
        this.#z = obj.z
        this.#y = obj.y
        this.#rotation = obj.rotation
    }

    moveBy(x, z, y, rotation){
        var data = JSON.stringify({"type": "moveby", "value": {"id": this.#id, "x": x, "z": z, "y": y, "rotation": rotation}})
        send(data)
    }

    movedBy(obj){
        this.#x += obj.x
        this.#z += obj.z
        this.#y += obj.y
        this.#rotation = ((this.#rotation + obj.rotation) % 4 + 4) % 4
    }
}

module.exports = Turtle