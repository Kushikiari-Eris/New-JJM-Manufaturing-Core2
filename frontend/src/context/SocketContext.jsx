import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

// Create context
const SocketContext = createContext(null);

// Custom Hook
export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Use environment variable for production readiness
    const SOCKET_SERVER_URL = import.meta.env.VITE_SOCKET_SERVER || "http://localhost:7684";

    const newSocket = io(SOCKET_SERVER_URL, {
      withCredentials: true,
      reconnection: true, 
      reconnectionAttempts: 5, 
      reconnectionDelay: 3000, 
    });

    // Set socket instance
    setSocket(newSocket);

    // Cleanup on unmount
    return () => {
      newSocket.disconnect();
    };
  }, []); // Only run once on mount

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};
