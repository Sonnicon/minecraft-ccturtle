websocket = null
initializeWebsocket()

function initializeWebsocket(){
    if(websocket != null){
        websocket.close
    }
    return websocket = new WebSocket("ws://localhost:17798", "control")
}

websocket.addEventListener("message", function (event) {
    console.log("Message from server ", event.data);
});

function texteval(){
    var map = {"type": "eval",
        "value": document.getElementById("text-eval").value}
    send(JSON.stringify(map))
}

function send(obj){
    if(websocket.readyState == 1){
        websocket.send(obj)
    }else if(confirm("Not connected to server. Attempt reconnect?")){
        initializeWebsocket()
    }
}