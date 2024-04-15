import React from 'react';
import './App.scss';

import {BrowserRouter, Route, Routes} from 'react-router-dom';
import LeftPane from "./components/leftPane/leftPane";
import Feed from "./components/feed/feed";

function App() {
    return (
        <BrowserRouter>
            <div className={"app"}>
                <LeftPane/>
                <div className={"route-content"}>
                    <Routes>
                        <Route path={"/"} element={<Feed/>}/>
                        <Route path={"/explore"} element={"Explore"}/>
                        <Route path={"/notifications"} element={"Notifications"}/>
                        <Route path={"/messages"} element={"Messages"}/>
                        <Route path={"/bookmarks"} element={"Bookmarks"}/>
                        <Route path={"/lists"} element={"Lists"}/>
                        <Route path={"/profile"} element={"Profile"}/>
                    </Routes>
                </div>
                <div className={"right-pane"}>Right Pane</div>
            </div>
        </BrowserRouter>
    )
}

export default App;