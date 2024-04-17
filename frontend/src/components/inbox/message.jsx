import React, {useState} from 'react';
import './message.scss';
import {UserContext} from "../../App";

function Message({isUserMessage, ...data}) {
    const {tag} = React.useContext(UserContext);
    const [reactions, setReactions] = useState(() => {
        return data.reactions.split(',');
    });
    const emojis = ['😀', '😂', '😍', '😢', '😠', '👍', '👎', '❤️', '🔥', '🤔']

    const addRandomReaction = () => {
        const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
        setReactions([...reactions, randomEmoji]);

        console.log({
            messageId: data.id,
            tag: tag,
            reactionType: randomEmoji
        })

        fetch('http://localhost:3001/addReaction', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                messageId: data.id,
                tag: tag,
                reactionType: randomEmoji
            })
        }).then(r => r.json()).then(data => {
            console.log(data);
        });
    };

    const groupedReactions = reactions.reduce((grouped, reaction) => {
        grouped[reaction] = (grouped[reaction] || 0) + 1;
        return grouped;
    }, {});

    return (
        <div className={"message"} onClick={addRandomReaction}>
            <div className={`bubble ${isUserMessage ? 'user-message' : ''}`}>
                <div className="message-user">
                    {data.username}
                </div>
                <div className="message-content">
                    {data.content}
                </div>
            </div>
            <div className={`message-reactions ${isUserMessage ? 'user-message' : ''}`}>
                {Object.entries(groupedReactions).map(([reaction, count]) => (
                    <span className={"reaction"}>{reaction} {count}</span>
                ))}
            </div>
        </div>
    );
}

export default Message;