import React, {useState} from "react";
import "./publisher.scss";
import {media, poll} from "../../assets/icons/icons";
import pfp from '../../assets/images/defaultPFP.jpg';
import {UserProvider} from "../../contexts/userProvider";
import {UserContext} from "../../App";

const getMentions = (content) => {
    return content.split(" ").filter(word => word.startsWith("@"));
}

const getHashtags = (content) => {
    return content.split(" ").filter(word => word.startsWith("#"));
}

function Publisher() {
    const {tag} = React.useContext(UserContext);

    const [tweetContent, setTweetContent] = useState({
        tag: tag,
        content: "",
        mentions: [],
        hashtags: [],
        has_media: false,
        has_poll: false,
    });

    const handleCheckboxChange = (event) => {
        setTweetContent({
            ...tweetContent,
            [event.target.name]: event.target.checked
        });
    };

    const handleTweet = async () => {
        tweetContent.mentions = getMentions(tweetContent.content);
        tweetContent.hashtags = getHashtags(tweetContent.content);

        const response = await fetch('http://localhost:3001/new', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(tweetContent)
        }).then((response) => {
            if (response.ok) {
                console.log("Tweet sent successfully");
            } else {
                console.log("Error sending tweet");
            }
        }).catch((error) => {
            console.error('=( Error:', error);
        });
    };

    return (
        <div className="publisher">
            <div className={"photo"}>
                <img
                    alt={"Profile Picture"}
                    src={pfp}
                />
            </div>
            <div className={"input"}>
                <div className={"content"}>
                    <textarea
                        className={"tweet-content"}
                        placeholder="What is happening?!"
                        value={tweetContent.content}
                        onChange={(e) => setTweetContent({...tweetContent, content: e.target.value})}
                    />
                </div>
                <div className={"options"}>
                    <div className={"icons"}>
                        {poll}<input type={"checkbox"} name="has_poll" onChange={handleCheckboxChange}/>
                        {media}<input type={"checkbox"} name="has_media" onChange={handleCheckboxChange}/>
                    </div>
                    <button className={"tweet-button"} onClick={handleTweet}>Tweet</button>
                </div>
            </div>
        </div>
    )
}

export default Publisher;