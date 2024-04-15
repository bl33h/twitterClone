import pfp from '../../assets/images/defaultPFP.jpg';
import media from '../../assets/images/defaultMedia.png';
import poll from '../../assets/images/defaultPoll.png';

import {
    analytics,
    likes,
    location as locationIcon,
    moreTweet,
    privateAccount,
    replies,
    retweets,
    save,
    share,
    verified,
} from "../../assets/icons/icons";
import './tweet.scss';

function convertHashtagsAndMentionsToLinks(content) {
    const hashtagRegex = /#(\w+)/g;
    const mentionRegex = /@(\w+)/g;
    let newContent = content.replace(hashtagRegex, '<a href="javascript:void(0)">#$1</a>');
    newContent = newContent.replace(mentionRegex, '<a href="javascript:void(0)">@$1</a>');
    return newContent;
}

const Tweet = ({data}) => {
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
                        {location && <span className={"dot"}>•</span>}
                        {location && <span className={"location-icon"}>{locationIcon}</span>}
                        {location && <span className={"location"}>{location}</span>}
                    </div>
                    <div className={"options"}>
                        <button>{moreTweet}</button>
                    </div>
                </div>
                <div className={"tweet-content"}
                     dangerouslySetInnerHTML={{__html: convertHashtagsAndMentionsToLinks(content)}}/>
                <div className={"tweet-media"}>
                    {has_media && <img src={media} alt="media"/>}
                    {has_poll && <img src={poll} alt="poll"/>}
                </div>
                <div className={"interactions"}>
                    <div className={"replies"}>
                        {replies} <span>{replies_amount}</span>
                    </div>
                    <div className={"retweets"}>
                        {retweets} <span>{retweets_amount}</span>
                    </div>
                    <div className={"likes"}>
                        {likes} <span>{likes_amount}</span>
                    </div>
                    <div className={"analytics"}>
                        {analytics}
                    </div>
                    <div className={"options"}>
                        <button>{save}</button>
                        <button>{share}</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Tweet;