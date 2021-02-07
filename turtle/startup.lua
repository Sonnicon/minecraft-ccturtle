address = "ws://localhost:17798"
shell.run("pastebin", "get", "4nRg9CHU", "json")
os.loadAPI("json")

x, z, y, rotation = 0, 0, 0
sinceLastConnected = 9999

options = {
    ping = function(value)
        sinceLastConnected = 0
        send("pong", nil)
    end,

    setPosition = function(value)
        x = value.x
        z = value.z
        y = value.y
        rotation = value.rotation
    end,

    evaluate = function(value)
        local f, e = loadstring(value)
        local ret = nil
        if f then
            ret = f()
        else
            ret = e
        end
        if value == nil then
            value = {}
        end

        send("evaluate", ret)
    end,

    moveBy = function(value)
        local movedx, movedz, movedy, startRotation = 0, 0, 0, rotation
        while value.y ~= movedy do
            if value.y > movedy then
                if turtle.detectUp() then
                    break
                end
                turtle.up()
                movedy = movedy + 1
            else
                if turtle.detectDown() then
                    break
                end
                turtle.down()
                movedy = movedy - 1
            end
        end

        if value.x > 0 then
            rotateTowards(1)
        elseif value.x < 0 then
            rotateTowards(3)
        end
        while value.x ~= movedx do
            if turtle.detect() then
                break
            end
            turtle.forward()
            movedx = movedx - (rotation - 2)
        end

        if value.z > 0 then
            rotateTowards(2)
        elseif value.z < 0 then
            rotateTowards(0)
        end
        while value.z ~= movedz do
            if turtle.detect() then
                break
            end
            turtle.forward()
            movedz = movedz + (rotation - 1)
        end
        rotateTowards(startRotation)

        x = x + movedx
        z = z + movedz
        y = y + movedy
        send("movedBy", {x = movedx, z = movedz, y = movedy})
    end,

    rotateTowards = function(value)
        rotateTowards(value)
        send("rotatedTowards", rotation)
    end
}

function rotateTowards(target)
    if target == rotation then
        return
    end

    local clockwise = (target > rotation)
    if math.abs(target - rotation) == 3 then
        clockwise = (target - rotation) == -3
    end

    while target ~= rotation do
        if clockwise then
            turtle.turnRight()
            rotation = math.fmod(rotation + 1, 4)
        else
            turtle.turnLeft()
            rotation = math.fmod(rotation + 3, 4)
        end 
    end
end

send = function(type, value)
    socket.send(json.encode({type = type, value = value}))
end

function receive()
    local msg, ignored = socket.receive(20)
    return msg
end

while true do
    while not socket do
        socket, err = http.websocket(address)
        if socket then
            sinceLastConnected = 0
            print("Socket connected")
        else
            sinceLastConnected = 9999
            print(err)
            os.sleep(10)
        end
    end
    local success, msg = pcall(receive)
    if msg and success then
        local object = json.decode(msg)
        local f = options[object.type]
        if f then
            f(object.value)
        end
    elseif not success then
        sinceLastConnected = 9999
    end
    if sinceLastConnected > 10 then
        print("Socket disconnected")
        socket.close()
        socket = nil
    end
end