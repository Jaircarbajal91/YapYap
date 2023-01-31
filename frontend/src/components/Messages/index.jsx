import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sendMessage } from '../../store/messages';
import { io } from "socket.io-client";

export default function Messages({ messages, channelId, dmId, imageId }) {
    const sessionUser = useSelector(state => state.session.user);
    const dispatch = useDispatch();
    const [message, setMessage] = useState('');

    const isDisabled = message.length === 0;

    const socket = io("http://localhost:8000");

    socket.on("connection", () => {
        console.log("Connected to server");
    });

    const send = e => {
        e.preventDefault();
        dispatch(sendMessage(message, sessionUser.id, { channelId, dmId, imageId }));
        socket.emit('newMessage', message);
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
