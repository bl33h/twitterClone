import {NavLink} from "react-router-dom";
import { twitter, home, explore, notifications, messages, lists, bookmarks, profile, more } from "./icons";

import './leftPane.scss'

const LeftPane = () => {
    return (
        <div className="left-pane">
            <div className={"container"}>
                <header>{twitter}</header>
                <nav>
                    <NavLink to={"/"}>
                        <span>{home} Home</span>
                    </NavLink>
                    <NavLink to={"/explore"}>
                        <span>{explore} Explore</span>
                    </NavLink>
                    <NavLink to={"/notifications"}>
                        <span>{notifications} Notifications</span>
                    </NavLink>
                    <NavLink to={"/messages"}>
                        <span>{messages} Messages</span>
                    </NavLink>
                    <NavLink to={"/bookmarks"}>
                        <span>{bookmarks} Bookmarks</span>
                    </NavLink>
                    <NavLink to={"/lists"}>
                        <span>{lists} Lists</span>
                    </NavLink>
                    <NavLink to={"/profile"}>
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
                            <div className={"name"}>Franz 🦦</div>
                            <div className={"username"}>@franz_cas</div>
                        </div>
                    </button>
                </footer>
            </div>
        </div>
    )
}

export default LeftPane;