import {NavLink} from "react-router-dom";
import './leftPane.scss'

const LeftPane = () => {
    return (
        <div className="left-pane">
            <div className={"container"}>
                <header>*icon*</header>
                <nav>
                    <NavLink to={"/"}>Home</NavLink>
                    <NavLink to={"/explore"}>Explore</NavLink>
                    <NavLink to={"/notifications"}>Notifications</NavLink>
                    <NavLink to={"/messages"}>Messages</NavLink>
                    <NavLink to={"/bookmarks"}>Bookmarks</NavLink>
                    <NavLink to={"/lists"}>Lists</NavLink>
                    <NavLink to={"/profile"}>Profile</NavLink>
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