import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sendMessage } from '../../store/messages';

export default function Messages({ messages, channelId }) {
    const sessionUser = useSelector(state => state.session.user);
    const dispatch = useDispatch();
    const [message, setMessage] = useState('');

    const send = e => {
        e.preventDefault();
        dispatch(sendMessage(message, sessionUser.id, { channelId }));
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
                <button type="submit">Send</button>
            </form>
        </div>
    )
};
