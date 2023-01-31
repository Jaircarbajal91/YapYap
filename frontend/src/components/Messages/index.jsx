import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sendMessage } from '../../store/messages';
import { io } from "socket.io-client";

export default function Messages({ messages, channelId, dmId, imageId }) {
    const sessionUser = useSelector(state => state.session.user);
    const dispatch = useDispatch();
    const [message, setMessage] = useState('');
    const [socket, setSocket] = useState(null);
    const [socketConnected, setSocketConnected] = useState(false);
    const isDisabled = message.length === 0;

    useEffect(() => {
        setSocket(io("http://localhost:8000"));
    }, []);

    useEffect(() => {
        if (!socket) return;
        socket.on("connect", () => {
            setSocketConnected(socket.connected);
            console.log("connected")
        });

    }, [socket, socketConnected]);

    socket?.once("newMessage", message => {
        console.log(message);
        document.querySelector("ul").innerHTML += `<li>${message}</li>`;
    });

    const send = e => {
        e.preventDefault();
        socket.emit("chatMessage", message)
        dispatch(sendMessage(message, sessionUser.id, { channelId, dmId, imageId }));
    };


    return (
        <div>
            <h1>Messages</h1>
            <ul>
                {messages.map(message => (
                    <li key={message.id}>
                        {message.message}
                    </li>
                ))}
            </ul>
            <form onSubmit={send}>
                <input
                    type="text"
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                />
                <button disabled={isDisabled} type="submit">Send</button>
            </form>
        </div>
    )
};
