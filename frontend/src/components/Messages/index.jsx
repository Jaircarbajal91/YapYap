import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getMessages } from '../../store/messages';
// import { useParams } from 'react-router-dom';
// const Heap = require("mnemonist/heap");

export default function Messages({ channelId }) {
    const dispatch = useDispatch();
    const messages = Object.values(useSelector(state => state.messages));
    console.log(channelId);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const messages = dispatch(getMessages(channelId));
        setIsLoaded(true);  
        console.log("messages", messages);
    }, [dispatch, channelId]);

    return isLoaded && (
        <div>
            <h1>Messages</h1>
            <ul>
                {Object.values(messages).map(message => (
                    <li key={message.id}>
                        {message.message}
                    </li>
                ))}
            </ul>
        </div>
    )
}