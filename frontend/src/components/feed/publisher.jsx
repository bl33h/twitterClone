import React from "react";
import "./publisher.scss";
import {media, poll} from "../../assets/icons/icons";
import pfp from '../../assets/images/defaultPFP.jpg';

function Publisher() {
    return (
        <div className="publisher">
            <div className={"photo"}>
                <img
                    alt={"Profile Picture"}
                    src={pfp}
                />
            </div>
            <div className={"input"}>
                <div className={"content"}>
                    <textarea className={"tweet-content"} placeholder="What is happening?!"/>
                </div>
                <div className={"options"}>
                    <div className={"icons"}>
                        {poll}<input type={"checkbox"}/>
                        {media}<input type={"checkbox"}/>
                    </div>
                    <button className={"tweet-button"}>Tweet</button>
                </div>
            </div>
        </div>
    )
}

export default Publisher;