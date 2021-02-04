const main = require("./main")
const User = require("./user")

class Turtle {
    #id
    #connection

    #x = 0
    #z = 0
    #y = 0
    // 0 - North (-z), 1 - East (+x), 2 - South (+z), 3 - West (-x)
    #rotation = 0

    static nextid = 0
    static turtles = {}

    static #packetHandlers = {
        "movedBy": function(turtle, obj){
            var pos = turtle.getPosition()
            turtle.#setPosition(obj.x + pos.x, obj.z + pos.z, obj.y + pos.y)
        },

        "rotatedTowards": function(turtle, obj){
            turtle.#setRotation(obj.value)
        }
    }

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
            Turtle.handlePacket(id, obj)
            User.User.sendUser(obj.id, message)
        });
        
        this.send(JSON.stringify({"type": "setPosition", "value": {"x": this.#x, "z": this.#z, "y": this.#y, "rotation": this.#rotation}}))
        User.User.sendAllUsers(this.getUserData())
    }

    getUserData(){
        return JSON.stringify({"type": "turtleCreated", "id": this.#id, "value": {"x": this.#x, "z": this.#z, "y": this.#y, "rotation": this.#rotation}})
    }

    static handlePacket(id, obj){
        Turtle.#packetHandlers[obj.type](Turtle.turtles[id], obj.value)
    }

    getId(){
        return this.#id
    }

    #setPosition(x, z, y){
        this.#x = x
        this.#z = z
        this.#y = y
    }

    getPosition(){
        return {"x": this.#x, "z": this.#z, "y": this.#y}
    }

    #setRotation(value){
        this.#rotation = (value % 4 + 4) % 4
    }

    getRotation(){
        return this.#rotation
    }

    static sendAllTurtles(obj){
        for(var key in Turtle.turtles){
            Turtle.turtles[key].send(obj)
        }
    }

    static sendTurtle(id, obj){
        Turtle.turtles[id].send(obj)
    }

    send(obj){
        this.#connection.send(obj)
    }
}

module.exports.Turtle = Turtle