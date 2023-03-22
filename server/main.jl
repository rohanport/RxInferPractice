using HTTP.WebSockets

server = WebSockets.listen("0.0.0.0", 8081) do ws
    for msg in ws
        new_msg = string(msg, " to you too.")
        println(new_msg)
        send(ws, new_msg)
    end
end

