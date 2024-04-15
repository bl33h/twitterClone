import {NavLink} from "react-router-dom";
import './leftPane.scss'

const LeftPane = () => {
    return (
        <div className="left-pane">
            <div className={"container"}>
                <header>*icon*</header>
                <nav>
                    <NavLink to={"/"}>
                        <span>Home</span>
                    </NavLink>
                    <NavLink to={"/explore"}>
                        <span>Explore</span>
                    </NavLink>
                    <NavLink to={"/notifications"}>
                        <span>Notifications</span>
                    </NavLink>
                    <NavLink to={"/messages"}>
                        <span>Messages</span>
                    </NavLink>
                    <NavLink to={"/bookmarks"}>
                        <span>Bookmarks</span>
                    </NavLink>
                    <NavLink to={"/lists"}>
                        <span>Lists</span>
                    </NavLink>
                    <NavLink to={"/profile"}>
                        <span>Profile</span>
                    </NavLink>
                    <button className={"more"}>
                        <span>More</span>
                    </button>

                </nav>
                <button className={"tweet-button"}>Tweet</button>
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