import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const socketUrl = import.meta.env.VITE_WEBSOCKET_URL || "ws://localhost:7684"; 
    const isProduction = import.meta.env.MODE === "production"; 

    console.log(`🌍 Connecting to WebSocket: ${socketUrl} (Mode: ${isProduction ? "Production" : "Development"})`);

    const newSocket = io(socketUrl, {
      transports: ["websocket"],
      autoConnect: false, 
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 3000,
    });

    const handleConnect = () => console.log(`✅ WebSocket Connected: ${socketUrl}`);
    const handleError = (error) => console.error("❌ WebSocket Connection Error:", error);
    const handleDisconnect = (reason) => console.warn(`⚠️ WebSocket Disconnected: ${reason}`);

    newSocket.on("connect", handleConnect);
    newSocket.on("connect_error", handleError);
    newSocket.on("disconnect", handleDisconnect);

    newSocket.open(); // Explicitly attempt to connect
    setSocket(newSocket);

    return () => {
      console.log("🔌 Cleaning up WebSocket connection...");
      newSocket.off("connect", handleConnect);
      newSocket.off("connect_error", handleError);
      newSocket.off("disconnect", handleDisconnect);
      newSocket.disconnect();
    };
  }, []);

  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};
