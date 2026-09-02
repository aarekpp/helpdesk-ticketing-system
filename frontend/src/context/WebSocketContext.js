import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
  const stompClient = useRef(null);
  const subscriptionQueue = useRef([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    stompClient.current = Stomp.over(
      () => new SockJS(`${process.env.REACT_APP_WS}/ws`),
    );
    stompClient.current.reconnect_delay = 5000;
    stompClient.current.connect(
      {},
      () => {
        setConnected(true);
      },
      (error) => {
        setConnected(false);
      },
    );
    return () => {
      if (stompClient.current) {
        stompClient.current.disconnect(() => {
          setConnected(false);
        });
      }
    };
  }, []);
  useEffect(() => {
    if (connected && stompClient.current) {
      while (subscriptionQueue.current.length > 0) {
        const { topic, callback } = subscriptionQueue.current.shift();
        stompClient.current.subscribe(topic, (message) => {
          callback(JSON.parse(message.body));
        });
      }
    }
  }, [connected]);
  const subscriptionRefs = useRef({});
  const subscribe = (topic, callback) => {
    if (subscriptionRefs.current[topic]) {
      return;
    }
    if (connected && stompClient.current) {
      const subscription = stompClient.current.subscribe(topic, (message) => {
        callback(JSON.parse(message.body));
      });
      subscriptionRefs.current[topic] = subscription.id;
    } else {
      subscriptionQueue.current.push({ topic, callback });
    }
  };
  const unsubscribe = (topic) => {
    if (subscriptionRefs.current[topic]) {
      if (connected && stompClient.current) {
        stompClient.current.unsubscribe(subscriptionRefs.current[topic]);
        delete subscriptionRefs.current[topic];
      }
    }
  };
  return (
    <WebSocketContext.Provider value={{ subscribe, unsubscribe, connected }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocketContext = () => useContext(WebSocketContext);
