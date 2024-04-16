import './inbox.scss';
import React, {useState} from 'react'
import {config, newMessage} from "../../assets/icons/icons";
import Tray from "./tray";

function Inbox() {
    const [messages, setMessages] = useState([
            {
                name: "John Doe",
                username: "johndoe",
                time: "1h",
            },
            {
                name: "Jane Doe",
                username: "janedoe",
                time: "2h",
            },
            {
                name: "James Doe",
                username: "jamesdoe",
                time: "3h",
            },
        ],
    );

    return (
        <div className={"messages"}>
            <div className={"header"}>
                <span id={"title"}>Messages</span>
                <div className={"options"}>
                    <button className={"option"}>{config}</button>
                    <button className={"option"}>{newMessage}</button>
                </div>
            </div>
            <div className={"search"}>
                <input type={"text"} placeholder={"Search Direct Messages"}/>
            </div>
            <div className={"tray-container"}>
                {messages.map((message, index) => (
                    <Tray key={index} name={message.name} username={message.username} time={message.time}/>
                ))}
            </div>
        </div>
    )
}

export default Inbox;