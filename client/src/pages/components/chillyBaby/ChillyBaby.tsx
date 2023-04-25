import React, { useEffect, useState } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { SERVER_URL } from "../constants";
import { ChillyBabyChart } from "./ChillyBabyChart";

const INTERVAL = 1000; //ms between each timestep
const target = 37.7;

export const ChillyBaby = () => {
  const [babyLocation, setBabyLocation] = useState(150.0);

  const sendLatestState = () =>
    sendJsonMessage({
      position: babyLocation,
    });

  const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket<{
    velocity: number;
  }>(SERVER_URL, { onMessage: ({ data }) => console.log(JSON.parse(data)) });

  useEffect(() => {
    if (lastJsonMessage !== null) {
      const { velocity } = lastJsonMessage;
      setBabyLocation(babyLocation + velocity);
      setTimeout(sendLatestState, INTERVAL);
    }
  }, [lastJsonMessage]);

  if (readyState !== ReadyState.OPEN) {
    return null;
  }

  return <ChillyBabyChart targetPosition={target} location={babyLocation} />;
};
