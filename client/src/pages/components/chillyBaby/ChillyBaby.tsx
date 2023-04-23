import React, { useEffect, useState } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { SERVER_URL } from "../constants";
import { ChillyBabyChart } from "./ChillyBabyChart";

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
      setTimeout(sendLatestState, 1500);
    }
  }, [lastJsonMessage]);

  if (readyState !== ReadyState.OPEN) {
    return null;
  }

  return (
    <ChillyBabyChart
      data={[{ position: babyLocation, height: 20 }]}
      targetPosition={37.7}
    />
  );
};
