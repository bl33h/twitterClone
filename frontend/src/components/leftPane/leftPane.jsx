import {NavLink} from "react-router-dom";
import {
    bookmarks,
    explore,
    home,
    lists,
    messages,
    more,
    notifications,
    profile,
    twitter
} from "../../assets/icons/icons";
import {UserContext} from "../../App";
import React from "react";

import './leftPane.scss'

const LeftPane = () => {
    const {tag, username} = React.useContext(UserContext);

    return (
        <div className="left-pane">
            <div className={"container"}>
                <header>{twitter}</header>
                <nav>
                    <NavLink to={"/"} exact activeClassName="selected">
                        <span>{home} Home</span>
                    </NavLink>
                    <NavLink to={"/explore"} activeClassName="selected">
                        <span>{explore} Explore</span>
                    </NavLink>
                    <NavLink to={"/notifications"} activeClassName="selected">
                        <span>{notifications} Notifications</span>
                    </NavLink>
                    <NavLink to={"/messages"} activeClassName="selected">
                        <span>{messages} Messages</span>
                    </NavLink>
                    <NavLink to={"/bookmarks"} activeClassName="selected">
                        <span>{bookmarks} Bookmarks</span>
                    </NavLink>
                    <NavLink to={"/lists"} activeClassName="selected">
                        <span>{lists} Lists</span>
                    </NavLink>
                    <NavLink to={"/profile"} activeClassName="selected">
                        <span>{profile} Profile</span>
                    </NavLink>
                    <button className={"more"}>
                        <span>{more}More</span>
                    </button>

                </nav>
                <button className={"tweet"}>Tweet</button>
                <footer>
                    <button className={"account"}>
                        <div className={"photo"}>
                            <img
                                alt="Franz 🦦"
                                src="https://pbs.twimg.com/profile_images/1756230758350405632/sYvdd6HC_normal.jpg"
                            />
                        </div>
                        <div>
                            <div className={"name"}>{username}</div>
                            <div className={"username"}>@{tag}</div>
                        </div>
                    </button>
                </footer>
            </div>
        </div>
    )
}

export default LeftPane;