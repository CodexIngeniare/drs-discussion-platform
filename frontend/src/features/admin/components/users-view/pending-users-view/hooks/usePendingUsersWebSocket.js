import { useState, useEffect, useRef, useContext } from 'react';
import { AuthContext } from '../../../../../../context';
import io from 'socket.io-client';

const usePendingUsersWebSocket = (url) => {
    const { token } = useContext(AuthContext);
    const [isMounted, setIsMounted] = useState(false);
    const [pendingUsers, setPendingUsers] = useState([]);
    const [isConnected, setIsConnected] = useState(false);
    const [error, setError] = useState(null);
    const socket = useRef(null);

    useEffect(() => {
        setIsMounted(true);
    }, []);
    useEffect(() => {
        if(!isMounted) {
            return;
        }

        socket.current = io.connect(url, {
            query: { token: token },
            transports: ['websocket']
        });

        socket.current.on('connect', () => {
            console.log("Websocket connected!");
            setIsConnected(true);
        });

        socket.current.on('pending_users', (data) => {
            setPendingUsers(data);
        });

        socket.current.on('new_pending_user', (user) => {
            setPendingUsers((prevUsers) => [...prevUsers, user]);
        });

        socket.current.on('error', (data) => {
            setError(data.message);
            console.error('Error:', data.message);
        });

        socket.current.on('disconnect', () => {
            setIsConnected(false);
            console.log('Websocket disconnected.');
        });

        return () => {
            socket.current.disconnect();
        };
    }, [isMounted, url, token]);

    const removeUserFromPending = (userId) => {
        setPendingUsers((prevUsers) => prevUsers.filter(user => user.id !== userId));
      };

    return { pendingUsers, isConnected, error, removeUserFromPending };
};

export default usePendingUsersWebSocket;