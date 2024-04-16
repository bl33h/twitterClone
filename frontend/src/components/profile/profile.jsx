import React, {useState} from "react";
import {birthday, calendar, location} from "../../assets/icons/icons";
import "./profile.scss";

function Profile() {
    const [profile, setProfile] = useState(
        {
            "tag": "franz_castillo",
            "username": "Franz 🤔",
            "description": "Una descripción de usuary sexy",
            "birthdate": "1990-01-01",
            "joined_on": "2010-01-01",
            "is_profile_public": true,
            "is_blue": false,
            "located_in": {
                "timestamp": "2022-01-01",
                "currently_in": "City Name",
                "lives_there": true,
                "location_name": "Paris, France",
            },
            "following_amount": 100,
            "followers_amount": 200,
            "tweets": [
                {
                    "id": 1,
                    "user": {
                        "tag": "userTag",
                        "username": "username",
                        "is_profile_public": true,
                        "is_blue": false
                    },
                    "timestamp": "2022-01-01",
                    "has_media": true,
                    "has_poll": false,
                    "content": "Tweet content",
                    "likes_amount": 50,
                    "retweets_amount": 20,
                    "replies_amount": 10
                }
            ]
        },
    );

    return (
        <div className={"profile"}>
            <div className={"edit"}>
                <button>Edit Profile</button>
            </div>
            <div className={"information"}>
                <div className={"names"}>
                    <span id={"username"}>{profile.username}</span>
                    <span id={"tag"}>@{profile.tag}</span>
                </div>
                <br/>
                <div className={"description"}>
                    <p>{profile.description}</p>
                </div>
                <br/>
                <div className={"dates"}>
                    <div className={"personal"}>
                        <span className={"move"}>{location} {profile.located_in.location_name}</span>
                        <span className={"move"}>{birthday} {profile.birthdate}</span>
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
    );
}

export default Profile;