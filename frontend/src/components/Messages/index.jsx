import React, { useState } from 'react';

export default function Messages({ messages }) {

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
        </div>
    )
}
