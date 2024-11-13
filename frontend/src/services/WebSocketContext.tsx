import React, { createContext, useContext, useEffect, useState } from 'react';

type Message = {
    Bid: number;
    Ask: number;
    Last: number;
    Timestamp: string;
};

const WebSocketContext = createContext<Message | null>(null);

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [message, setMessage] = useState<Message | null>(null);

    useEffect(() => {
        const ws = new WebSocket("ws://localhost:8080/ws");

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setMessage(data);
        };

        ws.onclose = () => console.log("Conexión WebSocket cerrada");

        return () => ws.close();
    }, []);

    return (
        <WebSocketContext.Provider value={message}>
            {children}
        </WebSocketContext.Provider>
    );
};

export const useWebSocket = () => useContext(WebSocketContext);