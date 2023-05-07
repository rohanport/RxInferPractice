using RxInfer, Random

@model function chilly_baby(T)
    # Constants
    desired_temp = constvar(37.7)
    fire_temp = constvar(100.0)
    accuracy = constvar(0.00001)

    println("making action states")
    # Action state
    pred_velocity_m_k = datavar(Float64, T) # Latest and predicted velocity means
    pred_velocity_v_k = datavar(Float64, T) # Latest and predicted velocity variance

    println("making sensory states")
    position = datavar(Float64) # Latest position
    position_k = randomvar(T) # Predicted positions
    
    println("making internal states")
    temp_k = randomvar(T) # Predicted temp
    
    println("making velocity states")
    velocity_k = randomvar(T) # Predicted velocities

    println("making look ahead states")
    prev_position = position

    for k in 1:T
        println(k)
        velocity_k[k] ~ NormalMeanVariance(pred_velocity_m_k[k], pred_velocity_v_k[k])
        println("got velocity")

        position_k[k] ~ NormalMeanVariance(velocity_k[k] + prev_position, accuracy)
        prev_position = position_k[k]
        println("got position")

        temp_k[k] ~ NormalMeanVariance(fire_temp - position_k[k], accuracy)
        temp_k[k] ~ NormalMeanVariance(desired_temp, 0.5) # Goal temp 
        println("got temp")
    end

    println("model done")
end



function create_agent(sensory_datastream, initial_position)

    lookahead = 5
    resting_velocity_mean = 0.0
    resting_velocity_var = 1.0

    pred_means = (distributions) -> push!([mean(distributions[n]) for n=2:lookahead], resting_velocity_mean)
    pred_vars = (distributions) -> push!([var(distributions[n]) for n=2:lookahead], resting_velocity_var)

    autoupdates = @autoupdates begin
        pred_velocity_m_k = pred_means(q(velocity_k))
        pred_velocity_v_k = pred_vars(q(velocity_k))
    end

     
    engine = rxinference(
        model         = chilly_baby(lookahead),
        datastream    = sensory_datastream,
        autoupdates   = autoupdates,
        initmarginals = (
            velocity_k = [NormalMeanVariance(resting_velocity_mean, resting_velocity_var) for n=1:lookahead], 
            position_k = [NormalMeanVariance(initial_position, 1.0) for n=1:lookahead],
        ),
        returnvars    = ( :velocity_k, :position_k ),
        iterations    = 10,
        autostart     = false,
        free_energy   = true,
    )
    
    RxInfer.start(engine)
    
    return engine
end