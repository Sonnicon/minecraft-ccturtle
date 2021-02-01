const WebSocket = require("ws");

const socket = new WebSocket.Server({ port: 17798 });

socket.on("connection", function connection(ws) {
    ws.on("message", function incoming(message) {
        console.log("received from %s: %s", ws.protocol, message);
        socket.clients.forEach(function(wb){
            if(ws.protocol != wb.protocol){
                wb.send(message)
            }
        })
    });
});