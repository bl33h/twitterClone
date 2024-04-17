import React, { useState } from 'react';
import './message.scss';

function Message({isUserMessage, ...data}) {
    const [reactions, setReactions] = useState(data.reactions);
    const emojis =  ['😀', '😂', '😍', '😢', '😠', '👍', '👎', '❤️', '🔥', '🤔']

    const addRandomReaction = () => {
        const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
        setReactions([...reactions, randomEmoji]);
    };

    const groupedReactions = reactions.reduce((grouped, reaction) => {
        grouped[reaction] = (grouped[reaction] || 0) + 1;
        return grouped;
    }, {});

    return (
        <div className={"message"} onClick={addRandomReaction}>
            <div className={`bubble ${isUserMessage ? 'user-message' : ''}`}>
                <div className="message-user">
                    {data.user.username}
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