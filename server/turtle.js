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

    //pinging
    #pong = true

    static #packetHandlers = {
        "pong": function(turtle, obj){
            turtle.pong()
            return false
        },

        "movedBy": function(turtle, obj){
            var pos = turtle.getPosition()
            turtle.#setPosition(obj.x + pos.x, obj.z + pos.z, obj.y + pos.y)
            return true
        },

        "rotatedTowards": function(turtle, obj){
            turtle.#setRotation(obj.value)
            return true
        },

        "inspectedAround": function(turtle, obj){
            return true
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
            console.log(1)
            if(Turtle.handlePacket(id, obj)){
                console.log(2)
                obj.id = id
                User.User.sendAllUsers(JSON.stringify(obj))
            }
        });
        
        this.send(JSON.stringify({"type": "setPosition", "value": {"x": this.#x, "z": this.#z, "y": this.#y, "rotation": this.#rotation}}))
        User.User.sendAllUsers(this.getUserData())
    }

    getUserData(){
        return JSON.stringify({"type": "turtleCreated", "id": this.#id, "value": {"x": this.#x, "z": this.#z, "y": this.#y, "rotation": this.#rotation}})
    }

    static handlePacket(id, obj){
        return Turtle.#packetHandlers[obj.type](Turtle.turtles[id], obj.value)
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

    ping(){
        if(this.#pong){
            this.#pong = false
            this.send(JSON.stringify({"type": "ping"}))
        }else{
            console.log("Lost connection to turtle %i", this.#id)
            this.remove()
        }
    }

    pong(){
        this.#pong = true
    }

    remove(){
        delete Turtle.turtles[this.#id]
        User.User.sendAllUsers(JSON.stringify({"type": "turtleRemoved", "value": this.#id}))
    }
}

setInterval(function(){
    for(var key in Turtle.turtles){
        Turtle.turtles[key].ping()
    }
}, 10000)

module.exports.Turtle = Turtle