import {useParams} from 'react-router-dom';
import React, {useState} from 'react';
import './chat.scss';
import {UserContext} from "../../App";
import Message from "./message";
import pfp from '../../assets/images/defaultPFP.jpg'
import Sender from "./sender";

function Chat() {
    const {id} = useParams();
    const {tag} = React.useContext(UserContext);

    const [messages, setMessages] = useState([
        {
            id: 1,
            user: {
                id: 1,
                username: 'donald90',
            },
            content: 'Hello',
            reactions: ['🤣', '🫵', '🤔'],
            timestamp: 1
        },
        {
            id: 2,
            user: {
                id: 2,
                username: 'Bob',
            },
            content: 'Hi Donald!',
            reactions: ['👍', '🎉'],
            timestamp: 2
        },
        {
            id: 3,
            user: {
                id: 1,
                username: 'donald90',
            },
            content: 'How are you?',
            reactions: ['🤔', '👍'],
            timestamp: 3
        },
        {
            id: 4,
            user: {
                id: 2,
                username: 'Bob',
            },
            content: 'I am good. How about you?',
            reactions: ['👍', '🎉', '😊'],
            timestamp: 4
        },
        {
            id: 5,
            user: {
                id: 1,
                username: 'donald90',
            },
            content: 'I am fine too. Thanks for asking!',
            reactions: ['👍', '😊'],
            timestamp: 5
        },{
            id: 1,
            user: {
                id: 1,
                username: 'donald90',
            },
            content: 'Hello',
            reactions: ['🤣', '🫵', '🤔'],
            timestamp: 1
        },
        {
            id: 2,
            user: {
                id: 2,
                username: 'Bob',
            },
            content: 'Hi Donald!',
            reactions: ['👍', '🎉'],
            timestamp: 2
        },
        {
            id: 3,
            user: {
                id: 1,
                username: 'donald90',
            },
            content: 'How are you?',
            reactions: ['🤔', '👍'],
            timestamp: 3
        },
        {
            id: 4,
            user: {
                id: 2,
                username: 'Bob',
            },
            content: 'I am good. How about you?',
            reactions: ['👍', '🎉', '😊'],
            timestamp: 4
        },
        {
            id: 5,
            user: {
                id: 1,
                username: 'donald90',
            },
            content: 'I am fine too. Thanks for asking!',
            reactions: ['👍', '😊'],
            timestamp: 5
        },
    ]);
    // useEffect(() => {
    //     fetch(`http://localhost:3001/chat/${id}`)
    //         .then(res => res.json())
    //         .then(data => {
    //             setMessages(data);
    //         });
    // }, [id]);

    return (
        <div className={"chat"}>
            <div className={"header"}>
                <button onClick={() => window.location.href = '/'}>&larr;</button>
                <img src={pfp} alt={"User avatar"}/>
                <span id={"username"}>Username</span>
            </div>
            <div className={"messages"}>
                {messages.map(message => (
                    <Message key={message.id} {...message} isUserMessage={tag === message.user.username}/>
                ))}
            </div>
            <Sender/>
        </div>
    )
}

export default Chat;