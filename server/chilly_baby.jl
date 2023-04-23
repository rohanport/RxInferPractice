using RxInfer, Random

@model function chilly_baby(T)
    # Constants
    desired_position = constvar(37.7)

    println("making action states")
    # Action state
    prev_velocity_m_k = datavar(Float64, T) # Latest and predicted velocity means
    prev_velocity_v_k = datavar(Float64, T) # Latest and predicted velocity variance

    println("making sensory states")
    position = datavar(Float64) # Latest position
    position_k = randomvar(T) # Predicted positions

    println("making velocity states")
    velocity_k = randomvar(T) # Predicted velocities

    println("making look ahead states")
    prev_position = position
    for k in 1:T
        println(k)
        velocity_k[k] ~ NormalMeanVariance(prev_velocity_m_k[k], prev_velocity_v_k[k])
        println("got velocity")

        position_k[k] ~ NormalMeanVariance(velocity_k[k] + prev_position, tiny)
        println("got position")
        prev_position = position_k[k]
    end

    position_k[T] ~ NormalMeanVariance(desired_position, 1.0) # Goal position 

    println("model done")
end



function create_agent(sensory_datastream)

    lookahead = 5

    means = (distributions) -> [mean(distributions[n]) for n=1:lookahead]
    vars = (distributions) -> [var(distributions[n]) for n=1:lookahead]

    autoupdates = @autoupdates begin
        prev_velocity_m_k = means(q(velocity_k))
        prev_velocity_v_k = vars(q(velocity_k))
    end

     
    engine = rxinference(
        model         = chilly_baby(lookahead),
        datastream    = sensory_datastream,
        autoupdates   = autoupdates,
        initmarginals = (velocity_k = [NormalMeanVariance(0.0, 1.0) for n=1:lookahead],),
        returnvars    = ( :velocity_k, ),
        iterations    = 10,
        autostart     = false,
    )
    
    RxInfer.start(engine)
    
    return engine
end