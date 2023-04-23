include("./coinflip.jl")
include("./chilly_baby.jl")

using HTTP.WebSockets, JSON

# coinflip_server = WebSockets.listen("0.0.0.0", 8081) do ws
#     datastream = Subject(NamedTuple{(:y,), Tuple{Float64}})
#     engine = run_coinflip_simulation(datastream)
#     subscribe!(engine.posteriors[:θ], (val) -> send(ws, JSON.json(mode(val))))
#     subscribe!(datastream, (val) -> println(val))
#     for input in ws
#         next!(datastream, (y=parse(Float64, input),))
#     end
# end

chilly_baby_server = WebSockets.listen("0.0.0.0", 8081) do ws
    datastream = Subject(NamedTuple{(:position,), Tuple{Float64}})
    engine = create_agent(datastream)
    subscribe!(engine.posteriors[:velocity_k], (val) -> begin 
        action = mode(val[1])
        response = Dict([("velocity", action)])
        println(response)
        send(ws, JSON.json(response))
    end
    )

    send(ws, JSON.json(Dict([("velocity", 0.0)]))) # Initial velocity

    for input in ws
        json_input = JSON.parse(input)
        println(json_input)

        next!(datastream, (
                position=convert(Float64, get(json_input, "position", 0)), 
            )
        )
    end
end

