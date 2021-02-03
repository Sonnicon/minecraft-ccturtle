const WebSocket = require("ws");
const Turtle = require("./turtle")
const User = require("./user")

const socket = new WebSocket.Server({ port: 17798 });

socket.on("connection", function connection(ws) {
    if(ws.protocol == "control"){
        var user = new User.User(ws)
    }else{
        var turtle = new Turtle.Turtle(ws, 0, 0, 0, 0)
    }

    ws.on("message", function incoming(message) {
        console.log("main from %s: %s", ws.protocol, message);
        /*socket.clients.forEach(function(wb){
            if(ws.protocol != wb.protocol){
                wb.send(message)
            }
        })*/
    });
});