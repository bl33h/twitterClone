import React from 'react'
import {UserContext} from "../../App";

function SessionForm() {
    const {setTag, setUsername} = React.useContext(UserContext);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const username = event.target[0].value;
        const response = await fetch(`https://localhost:3001/login/${username}`);
        const data = await response.json();

        setTag(event.target[0].value);
        setUsername(data.username);
    };

    return (
        <form className={"session-form"} onSubmit={handleSubmit}>
            <div className={"form"}>
                <div className={"header"}>
                    <span id={"title"}>Log In</span>
                </div>
                <div className={"input"}>
                    <input type={"text"} placeholder={"Your @"}/>
                </div>
                <div className={"button"}>
                    <button>Log In</button>
                </div>
            </div>
        </form>
    );
}

export default SessionForm