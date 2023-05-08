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
  const [sendLatestState, setSendLatestState] = useState(false);

  const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket<{
    velocity: number;
    predicted_positions: number[];
    free_energy: number;
  }>(SERVER_URL, { onMessage: ({ data }) => console.log(JSON.parse(data)) });

  useEffect(() => {
    if (lastJsonMessage === null) return;

    const {
      velocity,
      predicted_positions: newPredictedPositions,
      free_energy: freeEnergy,
    } = lastJsonMessage;
    if (newPredictedPositions !== undefined)
      setPredictedPositions(newPredictedPositions);
    if (freeEnergy !== undefined)
      setFreeEnergyHistory(freeEnergyHistory.slice(1).concat([freeEnergy]));
    if (velocity !== undefined) {
      setPosition(position + velocity);
      setTimeout(() => setSendLatestState(true), INTERVAL);
    }
  }, [lastJsonMessage]);

  useEffect(() => {
    if (!sendLatestState) return;
    const message = {
      position,
    };
    console.log(message);
    sendJsonMessage(message);
    setSendLatestState(false);
  }, [sendLatestState, position]);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      const moveDistance = 10;
      if (event.key === "ArrowRight") {
        setPosition(position + moveDistance);
      } else if (event.key === "ArrowLeft") {
        setPosition(position - moveDistance);
      }
    };

    document.addEventListener("keydown", handleKeyPress);

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [position, setPosition]);

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
