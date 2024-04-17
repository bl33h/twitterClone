import {useParams} from 'react-router-dom';
import React, {useEffect, useState} from 'react';
import './chat.scss';
import {UserContext} from "../../App";
import Message from "./message";
import pfp from '../../assets/images/defaultPFP.jpg'
import Sender from "./sender";

function Chat() {
    const {id} = useParams();
    const {tag} = React.useContext(UserContext);

    const [messages, setMessages] = useState([]);
    useEffect(() => {
        fetch(`http://localhost:3001/messages/${id}`)
            .then(res => res.json())
            .then(data => {
                setMessages(data);
            });
    }, [id]);

    return (
        <div className={"chat"}>
            <div className={"header"}>
                <button onClick={() => window.location.href = '/'}>&larr;</button>
                <img src={pfp} alt={"User avatar"}/>
                <span id={"username"}>{}</span>
            </div>
            <div className={"messages"}>
                {messages.map(message => (
                    <Message key={message.id} {...message} isUserMessage={tag === message.username}/>
                ))}
            </div>
            <Sender/>
        </div>
    )
}

export default Chat;