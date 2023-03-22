import React, { useState, useCallback, useEffect } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";

const SERVER_URL = "ws://localhost:8081";

export const WebSocketDemo = () => {
  //Public API that will echo messages sent to it back to the client
  const [messageHistory, setMessageHistory] = useState(
    [] as MessageEvent<unknown>[]
  );

  const { sendMessage, lastMessage, readyState } = useWebSocket(SERVER_URL);

  useEffect(() => {
    if (lastMessage !== null) {
      setMessageHistory((prev) => prev.concat(lastMessage));
    }
  }, [lastMessage, setMessageHistory]);

  const handleClickSendMessage = useCallback(() => sendMessage("Hello"), []);

  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  }[readyState];

  return (
    <div>
      <span>{`Connected To: ${SERVER_URL}`}</span>
      <button onClick={handleClickSendMessage}>Click Me to send 'Hello'</button>
      <span>The WebSocket is currently {connectionStatus}</span>
      {lastMessage ? <span>Last message: {lastMessage.data}</span> : null}
      <ul>
        {messageHistory.map((message, idx) => (
          <span key={idx}>{message ? `${message.data} ` : null}</span>
        ))}
      </ul>
    </div>
  );
};
