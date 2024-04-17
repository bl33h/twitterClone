import React from 'react';
import './chat.scss';

function Message(data){
    return (
        <div className="message">
            <div className="message-user">
                {data.user.username}
            </div>
            <div className="message-content">
                {data.content}
            </div>
            <div className="message-reactions">
                {data.reactions.map(reaction => (
                    <span>{reaction}</span>
                ))}
            </div>
        </div>
    );
}

export default Message;