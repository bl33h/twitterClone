import React, {useState} from 'react';

import Publisher from "./publisher";
import Tweet from '../tweet/tweet';

function Feed() {
    const [tweets, setTweets] = useState([
        {
            "id": 1,
            "user": {
                "at": "@franz_cas",
                "name": "Franz Castillo",
                "is_profile_public": false,
                "is_blue": true
            },
            "timestamp": "2022-01-01T00:00:00Z",
            "has_media": true,
            "has_poll": true,
            "content": "This is a sample tweet #hashtag |  @franz_cas",
            "likes_amount": 10,
            "retweets_amount": 2,
            "replies_amount": 5,
            "location": "Manila, Philippines",
        }, {
            "id": 1,
            "user": {
                "at": "@franz_cas",
                "name": "Franz Castillo",
                "is_profile_public": false,
                "is_blue": true
            },
            "timestamp": "2022-01-01T00:00:00Z",
            "has_media": false,
            "has_poll": true,
            "content": "This is a sample tweet #hashtag |  @.franz_cas",
            "likes_amount": 10,
            "retweets_amount": 2,
            "replies_amount": 5,
        },
    ]);

    // useEffect(() => {
    //     fetch('https://your-api-url.com/tweets')
    //         .then(response => response.json())
    //         .then(data => setTweets(data))
    //         .catch(error => console.error('Error:', error));
    // }, []);

    return (
        <div className={"feed"}>
            <Publisher/>
            <div className={"tweets"}>
                {tweets.map((tweet, index) => (
                    <Tweet key={index} data={tweet}/>
                ))}
            </div>
        </div>
    );
}

export default Feed;