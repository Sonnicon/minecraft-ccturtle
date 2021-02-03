const main = require("./main")
const Turtle = require("./turtle")

class User{
    #id
    #connection

    static nextid = 0
    static users = {}

    constructor(connection){
        this.#connection = connection
        this.#id = User.nextid
        User.nextid += 1
        User.users[this.#id] = this

        const id = this.#id
        connection.on("message", function incoming(message) {
            console.log("received from user %s: %s", id, message);
            var obj = JSON.parse(message)
            Turtle.Turtle.sendTurtle(obj.id, message)
        });

        for(var key in Turtle.Turtle.turtles){
            this.send(Turtle.Turtle.turtles[key].getUserData())
        }
    }

    static sendAllUsers(obj){
        for(var key in User.users){
            User.users[key].send(obj)
        }
    }

    static sendUser(id, obj){
        User.users[id].send(obj)
    }

    send(obj){
        this.#connection.send(obj)
    }
}

module.exports.User = User