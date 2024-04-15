import pfp from '../../assets/images/defaultPFP.jpg';
import {moreTweet, privateAccount, verified} from "../../assets/icons/icons";
import './tweet.scss';

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
        replies_amount
    } = data;

    return (
        <div className="tweet" id={id}>
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
                            {Math.floor((new Date() - new Date(data.timestamp)) / 1000 / 60 / 60)}h
                        </span>
                    </div>
                    <div className={"options"}>
                        <button>{moreTweet}</button>
                    </div>
                </div>
                <div className={"tweet-content"}>
                </div>
                <div className={"interactions"}>
                </div>
            </div>
        </div>
    )
}

export default Tweet;