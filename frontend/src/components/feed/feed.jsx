import React, {useEffect, useState} from 'react';

import Publisher from "./publisher";
import Tweet from '../tweet/tweet';
import {UserProvider} from "../../contexts/userProvider";
import {UserContext} from "../../App";

function parseJson(json) {
    return {
        id: json.id,
        user: {
            at: '@' + json.user.tag,
            name: json.user.username,
            is_profile_public: json.user.is_profile_public,
            is_blue: json.user.is_blue
        },
        timestamp: new Date(
            json.timestamp.year.low,
            json.timestamp.month.low - 1, // JavaScript counts months from 0
            json.timestamp.day.low,
            json.timestamp.hour.low,
            json.timestamp.minute.low,
            json.timestamp.second.low
        ),
        has_media: json.has_media,
        has_poll: json.has_poll,
        content: json.content,
        likes_amount: json.likes_amount,
        retweets_amount: json.retweets_amount,
        replies_amount: json.replies_amount,
        location: null, // As the JSON object doesn't have a location property, we set it to null
        impressions: json.impressions,
        engagements: json.engagements,
        detail_expands: json.detail_expands,
        new_followers: json.new_followers,
        profile_visits: json.profile_visits,
        money_generated: json.money_generated,
    };
}

function Feed() {
    const {tag} = React.useContext(UserContext);
    const [tweets, setTweets] = useState([]);

    useEffect(() => {
        fetch(`http://localhost:3001/feed/${tag}`)
            .then(response => response.json())
            .then(data => data.map(parseJson))
            .then(data => setTweets(data))
            .catch(error => console.error('Error:', error));
    }, []);

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