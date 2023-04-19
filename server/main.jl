include("./coinflip.jl")

using HTTP.WebSockets, JSON

server = WebSockets.listen("0.0.0.0", 8081) do ws
    datastream = Subject(NamedTuple{(:y,), Tuple{Float64}})
    engine = run_coinflip_simulation(datastream)
    subscribe!(engine.posteriors[:θ], (val) -> send(ws, JSON.json(mode(val))))
    subscribe!(datastream, (val) -> println(val))
    for input in ws
        next!(datastream, (y=parse(Float64, input),))
    end
end

