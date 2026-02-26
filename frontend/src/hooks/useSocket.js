import { useEffect, useRef } from 'react';
import io from 'socket.io-client';

export const useSocket = (token) => {
    const socketRef = useRef(null);

    useEffect(() => {
        if (token) {
            socketRef.current = io(process.env.REACT_APP_API_URL || 'http://localhost:5000', {
                auth: { token },
                transports: ['websocket']
            });

            socketRef.current.on('connect', () => {
                console.log('Socket connected');
            });

            socketRef.current.on('disconnect', () => {
                console.log('Socket disconnected');
            });

            return () => {
                if (socketRef.current) {
                    socketRef.current.disconnect();
                }
            };
        }
    }, [token]);

    return socketRef.current;
};
