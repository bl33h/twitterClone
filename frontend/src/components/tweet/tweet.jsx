import pfp from '../../assets/images/defaultPFP.jpg';
import media from '../../assets/images/defaultMedia.png';
import poll from '../../assets/images/defaultPoll.png';

import {UserProvider} from "../../contexts/userProvider";

import {
    analytics,
    likes,
    moreTweet,
    privateAccount,
    replies,
    retweets,
    save,
    share,
    verified,
} from "../../assets/icons/icons";
import './tweet.scss';
import React, {useState} from "react";
import {UserContext} from "../../App";

function convertHashtagsAndMentionsToLinks(content) {
    const hashtagRegex = /#(\w+)/g;
    const mentionRegex = /@(\w+)/g;
    let newContent = content.replace(hashtagRegex, '<a href="javascript:void(0)">#$1</a>');
    newContent = newContent.replace(mentionRegex, '<a href="javascript:void(0)">@$1</a>');
    return newContent;
}

function handleReply(tweetId) {
    console.log(`Reply call for on tweet ${tweetId}`);
}

function handleRetweet(tweetId) {
    console.log(`Retweet call for on tweet ${tweetId}`);
}

function handleLike(tweetId) {
    console.log(`Like call for on tweet ${tweetId}`);
}

function handleAnalytics(tweetId) {
    console.log(`Analytics call for on tweet ${tweetId}`);
}

function handleDelete(tweetId) {
    console.log(`Delete call for on tweet ${tweetId}`);

}

const Tweet = ({data}) => {
    const tag = React.useContext(UserContext);

    const {
        id,
        user: {
            at,
            name,
            is_profile_public,
            is_blue
        },
        timestamp,
        has_media,
        has_poll,
        content,
        likes_amount,
        retweets_amount,
        replies_amount,
        location,
    } = data;

    const handleFormSubmit = (event) => {
        event.preventDefault();

        const data = {
            id: id,
            content: editedContent,
        };

        // Make POST API call
        fetch('http://localhost:3001/modifyt', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then(data => {
                console.log('Success:', data);
            })
            .catch((error) => {
                console.error('Error:', error);
            });

    };

    const [isMenuVisible, setIsMenuVisible] = useState(false);
    const toggleMenu = () => {
        setIsMenuVisible(!isMenuVisible);
    };

    const [isEditFormVisible, setIsEditFormVisible] = useState(false);
    const [editedContent, setEditedContent] = useState(content);
    const toggleEditForm = () => {
        setIsEditFormVisible(!isEditFormVisible);
    };

    function handleEdit(tweetId) {
        toggleEditForm();
    }

    return (
        <div className="tweet">
            <div className={"photo"}>
                <img
                    alt={name}
                    src={pfp}
                />
            </div>
            <div className={"content"}>
                <div className={"tweet-header"}>
                    <div className={"names"}>
                        <span className={"tweet-name"}>{data.user.name}</span>
                        {data.user.is_blue && <span className={"badge"}>{verified}</span>}
                        {!data.user.is_profile_public && <span className={"badge"}>{privateAccount}</span>}
                        <span className={"tweet-username"}>{data.user.at}</span>
                        <span className={"dot"}>•</span>
                        <span className={"time"}>
                            {Math.floor((new Date() - new Date(timestamp)) / 1000 / 60 / 60)}h
                        </span>
                    </div>
                    <div className={"options"}>
                        <button onClick={toggleMenu}>{moreTweet}</button>
                        {isMenuVisible && (
                            <div className="menu">
                                <button onClick={() => handleEdit(id)}>Edit</button>
                                <button onClick={() => handleDelete(id)}>Delete</button>
                            </div>
                        )}
                    </div>
                </div>
                <div className={"tweet-content"}
                     dangerouslySetInnerHTML={{__html: convertHashtagsAndMentionsToLinks(content)}}/>
                <div className={"tweet-media"}>
                    {has_media && <img src={media} alt="media"/>}
                    {has_poll && <img src={poll} alt="poll"/>}
                </div>
                <div className={"interactions"}>
                    <button className={"replies"} onClick={() => handleReply(id)}>
                        {replies} <span>{replies_amount}</span>
                    </button>
                    <button className={"retweets"} onClick={() => handleRetweet(id)}>
                        {retweets} <span>{retweets_amount}</span>
                    </button>
                    <button className={"likes"} onClick={() => handleLike(id)}>
                        {likes} <span>{likes_amount}</span>
                    </button>
                    <button className={"analytics"} onClick={() => handleAnalytics(id)}>
                        {analytics}
                    </button>
                    <div className={"options"}>
                        <button>{save}</button>
                        <button>{share}</button>
                    </div>
                </div>
                {isEditFormVisible && (
                    <div className="edit-form">
                        <form onSubmit={handleFormSubmit}>
                            <label>
                                Content:
                                <textarea value={editedContent} onChange={e => setEditedContent(e.target.value)}/>
                            </label>
                            <button type="submit">Save</button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Tweet;