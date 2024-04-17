import React from 'react';
import './message.scss';

function Message({isUserMessage, ...data}) {
    return (
        <div className={"message"}>
            <div className={`bubble ${isUserMessage ? 'user-message' : ''}`}>
                <div className="message-user">
                    {data.user.username}
                </div>
                <div className="message-content">
                    {data.content}
                </div>
            </div>
            <div className={`message-reactions ${isUserMessage ? 'user-message' : ''}`}>
                {data.reactions.map(reaction => (
                    <span className={"reaction"}>{reaction}</span>
                ))}
            </div>
        </div>
    );
}

export default Message;