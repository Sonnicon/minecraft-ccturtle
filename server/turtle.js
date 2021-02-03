const main = require("./main")
const User = require("./user")

// todo
class Turtle {
    #id
    #connection

    #x
    #z
    #y
    // 0 - North (-z), 1 - East (+x), 2 - South (+z), 3 - West (-x)
    #rotation

    static nextid = 0
    static turtles = {}

    constructor(connection, x, z, y, rotation){
        this.#connection = connection
        this.#x = x
        this.#z = z
        this.#y = y
        this.#rotation = rotation

        this.#id = Turtle.nextid
        Turtle.nextid += 1
        Turtle.turtles[this.#id] = this

        const id = this.#id
        connection.on("message", function incoming(message) {
            console.log("received from turtle %s: %s", id, message);
            var obj = JSON.parse(message)
            User.User.sendUser(obj.id, message)
        });
        
        this.send(JSON.stringify({"type": "setPosition", "value": {"x": this.#x, "z": this.#z, "y": this.#y, "rotation": this.#rotation}}))
        User.User.sendAllUsers(this.getUserData())
    }

    getUserData(){
        return JSON.stringify({"type": "turtleCreated", "id": this.#id, "value": {"x": this.#x, "z": this.#z, "y": this.#y, "rotation": this.#rotation}})
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

    static sendAllTurtles(obj){
        for(var key in Turtle.turtles){
            Turtle.turtles[key].send(obj)
        }
    }

    static sendTurtle(id, obj){
        console.log(Turtle.turtles)
        Turtle.turtles[id].send(obj)
    }

    send(obj){
        this.#connection.send(obj)
    }
}

module.exports.Turtle = Turtle