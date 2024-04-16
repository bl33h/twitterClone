import React, {useEffect, useState} from "react";
import {birthday, calendar, location} from "../../assets/icons/icons";
import "./profile.scss";

function Profile() {
    const [profile, setProfile] = useState({});

    useEffect(() => {
        fetch("http://localhost:3001/profile/donald34")
            .then(res => res.json())
            .then(data => setProfile(data));
    }, []);

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
                        <span className={"move"}>
                            {location}
                            {profile.located_in ? profile.located_in.location_name : 'Location not provided'}
                        </span>
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