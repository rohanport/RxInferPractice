import React, { useEffect, useState } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { SERVER_URL } from "../constants";
import { ChillyBabyChart } from "./ChillyBabyChart";
import { FreeEnergyChart } from "./FreeEnergyChart";

const INTERVAL = 1000; //ms between each timestep
const fireTemp = 100;
const desiredTemp = 37.7;
const targetPosition = fireTemp - desiredTemp;
const freeEnergyHistoryLength = 50;

export const ChillyBaby = () => {
  const [position, setPosition] = useState(targetPosition + 100);
  const [predictedPositions, setPredictedPositions] = useState<number[]>([]);
  const [freeEnergyHistory, setFreeEnergyHistory] = useState(
    new Array(freeEnergyHistoryLength).fill(0)
  );

  const sendLatestState = () =>
    sendJsonMessage({
      position,
    });

  const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket<{
    velocities: number[];
    predicted_positions: number[];
    free_energy: number;
  }>(SERVER_URL, { onMessage: ({ data }) => console.log(JSON.parse(data)) });

  useEffect(() => {
    if (lastJsonMessage === null) return;

    const {
      velocities,
      predicted_positions: newPredictedPositions,
      free_energy: freeEnergy,
    } = lastJsonMessage;
    if (velocities) setPosition(position + velocities[0]);
    if (newPredictedPositions) setPredictedPositions(newPredictedPositions);
    if (freeEnergy)
      setFreeEnergyHistory(freeEnergyHistory.slice(1).concat([freeEnergy]));
    setTimeout(sendLatestState, INTERVAL);
  }, [lastJsonMessage]);

  if (readyState !== ReadyState.OPEN) {
    return null;
  }

  return (
    <>
      <ChillyBabyChart
        targetPosition={targetPosition}
        position={position}
        predictedPositions={predictedPositions}
      />
      <FreeEnergyChart freeEnergyHistory={freeEnergyHistory} />
    </>
  );
};
