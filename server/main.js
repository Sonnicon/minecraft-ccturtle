const WebSocket = require("ws");
const Turtle = require("./turtle")

const socket = new WebSocket.Server({ port: 17798 });

socket.on("connection", function connection(ws) {
    if(ws.protocol == "control"){
        console.log(Turtle)
        for(var key in Turtle.turtles){
            Turtle.turtles[key].sendData()
        }
    }else{
        var turtle = new Turtle(0, 0, 0, 0)
        turtle.sendData()
    }

    ws.on("message", function incoming(message) {
        console.log("received from %s: %s", ws.protocol, message);
        socket.clients.forEach(function(wb){
            if(ws.protocol != wb.protocol){
                wb.send(message)
            }
        })
    });
});

function sendClient(obj){
    socket.clients.forEach(function(ws){
        if(ws.protocol == "control"){
            ws.send(obj)
        }
    })
}

function sendTurtle(obj){
    socket.clients.forEach(function(ws){
        if(ws.protocol != "control"){
            ws.send(obj)
        }
    })
}

module.exports.sendClient = sendClient
module.exports.sendTurtle = sendTurtle