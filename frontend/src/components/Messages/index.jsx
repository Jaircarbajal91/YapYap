import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sendMessage } from '../../store/messages';
import { io } from "socket.io-client";

export default function Messages({ messages, channelId, dmId, imageId }) {
    // const messages = Object.values(useSelector(state => state.messages));
    const sessionUser = useSelector(state => state.session.user);
    const dispatch = useDispatch();
    const [message, setMessage] = useState('');
    const [messagesDisplayed, setMessagesDisplayed] = useState(messages);
    const socket = io();
    const [socketConnected, setSocketConnected] = useState(false);
    const isDisabled = message.length === 0;


    // create socket connection
    useEffect(() => {
        socket.on('connection', () => {
            setSocketConnected(true);
            console.log('socket connected')
        });
        return () => {
            socket.off('connection');
            setSocketConnected(false);
        }
    }, [socket, send]);


    function send(e) {
        e.preventDefault();
        socket.emit("chatMessage", message)
        // console.log(message)
        dispatch(sendMessage(message, sessionUser.id, { channelId, dmId, imageId }));
        setMessage('');
    };


    return (
        <div>
            <h1>Messages</h1>
            <ul>
                {messages.map(message => (
                    <li key={message.id}>{message.message}</li>
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
