import React, { useState } from 'react';
import {dmSVG} from "../../assets/icons/icons";
import './sender.scss';

function Sender() {
    const [message, setMessage] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        // Send the message
        console.log(message);
        // Clear the input field
        setMessage('');
    };

    return (
        <form className={"sender"} onSubmit={handleSubmit}>
            <input type="text" value={message} onChange={(e) => setMessage(e.target.value)}
                   placeholder="Type a message..."/>
            <button type="submit">Send</button>
        </form>
    );
}

export default Sender;