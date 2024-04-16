import React from 'react'
import {UserContext} from "../../App";

function SessionForm() {
    const {setTag, setUsername} = React.useContext(UserContext);

    const handleSubmit = async (event) => {
        try {
            event.preventDefault();
            const username = event.target[0].value;
            const response = await fetch(`http://localhost:3001/login/${username}`);
            const data = await response.json();
            setTag(data[0].tag);
            setUsername(data[0].username);
        } catch (error) {
            alert("Invalid username")
        }
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