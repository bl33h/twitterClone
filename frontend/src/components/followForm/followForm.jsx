import React from 'react'
import {UserContext} from "../../App";

function FollowForm() {
    const {tag} = React.useContext(UserContext);

    const handleSubmit = async (event) => {
        try {
            event.preventDefault();
            const to_follow = event.target[0].value;
            console.log({
                followerTag: tag,
                followeeTag: to_follow,
                isMuted: false,
                notificationsActive: true,
            })
            fetch('http://localhost:3001/follow', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    followerTag: tag,
                    followeeTag: to_follow,
                    isMuted: false,
                    notificationsActive: true,
                }),
            })
                .then(data => {
                    if (data.status === 200) {
                        alert("Followed!")
                    }
                    else {
                        alert("Failed to follow")
                    }
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        } catch (error) {
            alert("Invalid username")
        }
    };

    return (
        <form className={"session-form"} onSubmit={handleSubmit}>
            <div className={"form"}>
                <div className={"header"}>
                    <span id={"title"}>Follow User</span>
                </div>
                <div className={"input"}>
                    <input type={"text"} placeholder={"User's @"}/>
                </div>
                <div className={"button"}>
                    <button>Follow</button>
                </div>
            </div>
        </form>
    );
}

export default FollowForm