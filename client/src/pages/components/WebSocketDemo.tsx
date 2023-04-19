import React, { useState, useCallback, useEffect } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";

const SERVER_URL = "ws://localhost:8081";

export const WebSocketDemo = () => {
  //Public API that will echo messages sent to it back to the client
  const [messageHistory, setMessageHistory] = useState(
    [] as MessageEvent<unknown>[]
  );

  const [weight, setWeight] = useState<number>(0.5);

  const { sendMessage, lastMessage, readyState } = useWebSocket(SERVER_URL);

  useEffect(() => {
    if (lastMessage !== null) {
      setMessageHistory((prev) => prev.concat(lastMessage));
    }
  }, [lastMessage, setMessageHistory]);

  const nextCoinFlip = () => (Math.random() > weight ? 1.0 : 0.0);

  const handleClickSendMessage = useCallback(
    () => sendMessage(`${nextCoinFlip()}`),
    []
  );

  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  }[readyState];

  return (
    <div>
      <span>The WebSocket is currently {connectionStatus}</span>
      <br />
      <input
        type="number"
        value={weight}
        onChange={(event) => {
          try {
            const value = parseFloat(event.target.value);
            console.log(value);
            setWeight(value);
          } catch (e) {
            // Do nothing
          }
        }}
      />
      <button onClick={handleClickSendMessage}>Send</button>
      <br />
      <ul>
        {messageHistory.map((message, idx) => (
          <span key={idx}>{message ? `${message.data} ` : null}</span>
        ))}
      </ul>
    </div>
  );
};
