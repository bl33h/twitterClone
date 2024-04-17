import './inbox.scss';
import React, {useEffect, useState} from 'react'
import {config, newMessage} from "../../assets/icons/icons";
import Tray from "./tray";
import {UserContext} from "../../App";

function Inbox() {
    const {tag} = React.useContext(UserContext);
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

    // Fetch messaages
    useEffect(() => {
        fetch(`http://localhost:3001/chat/${tag}`)
            .then(response => response.json())
            .then(data => {
                console.log(data);
            }).catch(err => {
            console.log(err);
        })
    }, []);

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