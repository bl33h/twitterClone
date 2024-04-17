import React from 'react';
import './App.scss';

import {BrowserRouter, Route, Routes} from 'react-router-dom';
import LeftPane from "./components/leftPane/leftPane";
import Feed from "./components/feed/feed";
import Profile from "./components/profile/profile";
import Inbox from "./components/inbox/inbox";
import SessionForm from "./components/sessionForm/sessionForm";
import {UserProvider} from "./contexts/userProvider";
import Chat from "./components/inbox/chat";

export const UserContext = React.createContext(null);

function App() {
    return (
        <UserProvider>
            <BrowserRouter>
                <div className={"app"}>
                    <LeftPane/>
                    <div className={"route-content"}>
                        <Routes>
                            <Route path={"/"} element={<Feed/>}/>
                            <Route path={"/explore"} element={"Explore"}/>
                            <Route path={"/notifications"} element={"Notifications"}/>
                            <Route path={"/messages"} element={<Inbox/>}/>
                            <Route path={"/bookmarks"} element={"Bookmarks"}/>
                            <Route path={"/lists"} element={"Lists"}/>
                            <Route path={"/profile"} element={<Profile/>}/>
                            <Route path={"/chat/:id"} element={<Chat />} />
                        </Routes>
                    </div>
                    <div className={"right-pane"}><SessionForm/></div>
                </div>
            </BrowserRouter>
        </UserProvider>
    )
}

export default App;