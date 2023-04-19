using RxInfer, Random

# GraphPPL.jl export `@model` macro for model specification
# It accepts a regular Julia function and builds an FFG under the hood
@model function coin_model()
    # We endow θ parameter of our model with some prior
    θ ~ Beta(4.0, 8.0)
    # or, in this particular case, the `Uniform(0.0, 1.0)` prior also works:
    # θ ~ Uniform(0.0, 1.0)
    
    # We assume that outcome of each coin flip is governed by the Bernoulli distribution
    y = datavar(Float64)
    y ~ Bernoulli(θ)
end

# GraphPPL.jl export `@model` macro for model specification
# It accepts a regular Julia function and builds an FFG under the hood
@model function coin_datastream_model()
    # We endow θ parameter of our model with some prior
    α_prev = datavar(Float64)
    β_prev = datavar(Float64)

    θ ~ Beta(α_prev, β_prev)
    # or, in this particular case, the `Uniform(0.0, 1.0)` prior also works:
    # θ ~ Uniform(0.0, 1.0)

    # Observation variable
    # o = datavar(Float64)

    # We assume that outcome of each coin flip is governed by the Bernoulli distribution
    y = datavar(Float64)
    y ~ Bernoulli(θ)
end

function run_coinflip_model(weight)
    rng = MersenneTwister(42)
    n = 500

    dataset = float.(rand(rng, Bernoulli(weight), n));

    result = inference(
        model = coin_model(length(dataset)), 
        data  = (y = dataset, )
    )

    estimated = result.posteriors[:θ]

    return estimated
end 

function run_coinflip_simulation(datastream)

    # observation_stream = Subject(Tuple{Float64})
    # observation_memory = observation_stream.take_last(n)

    # # `@autoupdates` structure specifies how to update our priors based on new posteriors
    # # For example, every time we have updated a posterior over `x_current` we update our priors
    # # over `x_prev`
    autoupdates = @autoupdates begin 
        α_prev, β_prev = params(q(θ))
    end
     
    engine = rxinference(
        model         = coin_datastream_model(),
        datastream    = datastream,
        autoupdates   = autoupdates,
        initmarginals = (θ = Beta(4.0, 8.0),),
        returnvars    = (:θ, ),
        iterations    = 10,
        autostart     = false,
    )
    
    RxInfer.start(engine)
    
    return engine
end