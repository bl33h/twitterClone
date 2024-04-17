import React, { useState } from 'react';
import './sender.scss';
import {UserContext} from "../../App";

function getDeviceType() {
    let userAgent = navigator.userAgent;
    let platform = navigator.platform;
    let deviceType = "Unknown";
    let operatingSystem = "Unknown";

    if (/Android/i.test(userAgent)) {
        deviceType = "Android";
    } else if (/iPhone|iPad|iPod/i.test(userAgent)) {
        deviceType = "iOS";
    } else if (/Windows/i.test(userAgent)) {
        deviceType = "Windows";
    } else if (/Mac OS X/i.test(userAgent)) {
        deviceType = "Mac OS X";
    } else if (/Linux/i.test(userAgent)) {
        deviceType = "Linux";
    }

    // Check for different operating systems
    if (/Win/i.test(platform)) {
        operatingSystem = "Windows";
    } else if (/Mac/i.test(platform)) {
        operatingSystem = "Mac";
    } else if (/Linux/i.test(platform)) {
        operatingSystem = "Linux";
    } else if (/iPhone|iPad|iPod/i.test(platform)) {
        operatingSystem = "iOS";
    } else if (/Android/i.test(platform)) {
        operatingSystem = "Android";
    }

    return { deviceType, operatingSystem };
}

function getMentions(content) {
    return content.split(" ").filter(word => word.startsWith("@"));
}

function Sender({latest_order, chat_id}) {
    const {tag} = React.useContext(UserContext);
    const [message, setMessage] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();

        const newMessage = {
            content: message,
            mentions: getMentions(message),
            chat: chat_id,
            tag: tag,
            os: getDeviceType().operatingSystem,
            device: getDeviceType().deviceType,
            order: latest_order + 1
        };

        fetch('http://localhost:3001/newmessage', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newMessage)
        }).then(data => {
            console.log(data);
        });

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