import React, {useEffect, useState} from "react";
import {birthday, calendar, location as locationSVG, privateAccount, verified} from "../../assets/icons/icons";
import "./profile.scss";

import {UserContext} from "../../App";
import Tweet from "../tweet/tweet";

function transformTweet(tweet) {
    const timestampDate = new Date(
        tweet.timestamp.year.low,
        tweet.timestamp.month.low - 1, // JavaScript counts months from 0
        tweet.timestamp.day.low,
        tweet.timestamp.hour.low,
        tweet.timestamp.minute.low,
        tweet.timestamp.second.low
    );

    // Get the current date and time
    const currentDate = new Date();

    // Calculate the difference in hours
    const diffInMilliseconds = currentDate - timestampDate;
    const diffInHours = diffInMilliseconds / 1000 / 60 / 60;

    return {
        id: tweet.id,
        user: {
            at: '@' + tweet.user.tag,
            name: tweet.user.username,
            is_profile_public: tweet.user.is_profile_public,
            is_blue: tweet.user.is_blue
        },
        timestamp: diffInHours, // Now the timestamp field contains the difference in hours
        has_media: tweet.has_media,
        has_poll: tweet.has_poll,
        content: tweet.content,
        likes_amount: tweet.likes_amount,
        retweets_amount: tweet.retweets_amount,
        replies_amount: tweet.replies_amount,
        location: null
    };
}

function Profile() {
    const {tag} = React.useContext(UserContext);
    const [profile, setProfile] = useState({});
    useEffect(() => {
        fetch(`http://localhost:3001/profile/${tag}`)
            .then(res => res.json())
            .then(data => {
                data[0].birthday = data[0].birthday ? `${data[0].birthdate.year.low}-${data[0].birthdate.month.low}-${data[0].birthdate.day.low}` : 'Not provided';
                data[0].joined_on = data[0].joined_on ? `${data[0].joined_on.year.low}-${data[0].joined_on.month.low}-${data[0].joined_on.day.low}` : 'Not provided';
                try {
                    data[0].tweets = data[0].tweets.reverse();
                    data[0].tweets = data[0].tweets.map(transformTweet);
                } catch (e) {
                    data[0].tweets = []
                }
                setProfile(data[0]);
            }).catch(err => alert(err));
    }, [tag]);

    const [showForm, setShowForm] = useState(false);
    const [username, setUsername] = useState("");
    const [description, setDescription] = useState("");
    const [location, setLocation] = useState("");
    const [isPublic, setIsPublic] = useState(false);

    const handleEditProfileClick = () => {
        setUsername(profile.username);
        setDescription(profile.description);
        setLocation(profile.located_in ? profile.located_in.location_name : '');
        setIsPublic(profile.is_profile_public);

        setShowForm(!showForm);
    };

    const handleFormSubmit = (event) => {
        event.preventDefault();

        const username = event.target.elements[0].value;
        const description = event.target.elements[1].value;
        const location = event.target.elements[2].value;
        const isPublic = event.target.elements[3].checked;

        const data = {
            tag,
            username,
            description,
            location,
            isPublic
        };

        fetch("http://localhost:3001/modify", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
            .then(data => {
                console.log(data);
                setShowForm(false);
            }).catch(err => console.error(err));
    };

    return (
        <div className={"profile"}>
            <div className={"header"}>
                <div className={"edit"}>
                    <button onClick={handleEditProfileClick}>Edit Profile</button>
                </div>
                {showForm && (
                    <form onSubmit={handleFormSubmit}>
                        <input type={"text"} placeholder={"Username"} value={username}
                               onChange={e => setUsername(e.target.value)}/>
                        <textarea placeholder={"Description"} value={description}
                                  onChange={e => setDescription(e.target.value)}/>
                        <input type={"text"} placeholder={"Location"} value={location}
                               onChange={e => setLocation(e.target.value)}/>
                        <label>
                            <input type={"checkbox"} checked={isPublic} onChange={e => setIsPublic(e.target.checked)}/>
                            Public Profile
                        </label>
                        <button type="submit">Save</button>
                    </form>
                )}
                <div className={"information"}>
                    <div className={"names"}>
                        <span id={"username"}>{profile.username}</span>
                        <span id={"tag"}>@{profile.tag}</span>
                        {profile.is_blue && verified}
                        {profile.is_profile_public && privateAccount}
                    </div>
                    <br/>
                    <div className={"description"}>
                        <p>{profile.description}</p>
                    </div>
                    <br/>
                    <div className={"dates"}>
                        <div className={"personal"}>
                        <span className={"move"}>
                            <span
                                className={"move"}>{locationSVG} {profile.located_in ? profile.located_in.location_name : 'Location not provided'}</span>
                        </span>
                            <span className={"move"}>{birthday} {profile.birthday}</span>
                        </div>
                        <div className={"joined"}>
                            {calendar} <span>{profile.joined_on}</span>
                        </div>
                    </div>
                    <div className={"following"}>
                        <span id={"following-amount"}>{profile.following_amount}</span><span
                        className={"darken"}> Following</span>
                        <span id={"followers-amount"}>{profile.followers_amount}</span><span
                        className={"darken"}> Followers</span>
                    </div>
                </div>
            </div>
            <div className={"tweets"}>
                {profile.tweets && profile.tweets.map((tweet, index) => (
                    <Tweet key={index} data={tweet}/>
                ))}
            </div>
        </div>
    );
}

export default Profile;