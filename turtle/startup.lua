shell.run("pastebin","get","4nRg9CHU","json")
os.loadAPI("json")

local socket, err = http.websocket("ws://localhost:17798")
if not socket then
    error(err)
end
print("Socket connected")

options = {
    eval = function(value)
        local f, e = loadstring(value)
        local ret = nil
        if f then
            ret = f()
        else
            ret = e
        end
        socket.send({type = "evaluate", value = ret,})
    end
}

while true do
    local msg, ignored = socket.receive()
    local object = json.decode(msg)

    local f = options[object.type]
    if f then
        f(object.value)
    end
end