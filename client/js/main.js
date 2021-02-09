websocket = null
initializeWebsocket()

function initializeWebsocket(){
    if(websocket != null){
        websocket.close()
    }
    return websocket = new WebSocket("ws://localhost:17798", "control")
}

const typeHandlers = {
    "turtleCreated": function(obj){
        var turtle = new Turtle(obj.id, obj.value.x, obj.value.z, obj.value.y, obj.value.rotation)
    },

    "turtleRemoved": function(obj){
        Turtle.turtles[obj.value].remove()
    },

    "movedBy": function(obj){
        console.log("movedBy")
        Turtle.turtles[obj.id].movedBy(obj.value)    
    },

    "rotatedTowards": function(obj){
        Turtle.turtles[obj.id].setRotation(obj.value)
    },

    "inspectedAround": function(obj){

    }
}

websocket.addEventListener("message", function (event) {
    console.log("Message from server ", event.data);
    var json = JSON.parse(event.data)
    typeHandlers[json.type](json)
});

function texteval(){
    var map = {"type": "evaluate", "id": 0,
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