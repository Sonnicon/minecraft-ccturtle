websocket = null
initializeWebsocket()

function initializeWebsocket(){
    if(websocket != null){
        websocket.close
    }
    return websocket = new WebSocket("ws://localhost:17798", "control")
}

const typeHandlers = {
    "turtleCreated": function(obj){
        var turtle = new Turtle(obj.id, obj.x, obj.z, obj.y, obj.rotation)
    },

    "movedBy": function(obj){
        Turtle.turtles[obj.id].moveBy(obj)    
    },

    "rotatedTowards": function(obj){
        Turtle.turtles[obj.id].setRotation(obj.value)
    }
}

websocket.addEventListener("message", function (event) {
    console.log("Message from server ", event.data);
    var json = JSON.parse(event.data)
    typeHandlers[json.type](json.value)
});

function texteval(){
    var map = {"type": "evaluate",
        "value": document.getElementById("text-eval").value}
    send(JSON.stringify(map))
}

function send(obj){
    if(websocket.readyState == 1){
        websocket.send(obj)
    }else if(confirm("Not connected to server. Attempt reconnect?")){
        reset()
        initializeWebsocket()
    }
}

function reset(){
    Turtle.turtles = {}
}