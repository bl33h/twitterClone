import './inbox.scss';
import React from 'react'
import {config, newMessage} from "../../assets/icons/icons";

function Inbox () {
    return(
        <div className={"messages"}>
            <div className={"header"}>
                <span id={"title"}>Messages</span>
                <div className={"options"}>
                    <button className={"option"}>{config}</button>
                    <button className={"option"}>{newMessage}</button>
                </div>
            </div>
            <div className={"search"}>
                <input type={"text"} placeholder={"Search Direct Messages"}/>
            </div>
        </div>
    )
}

export default Inbox;