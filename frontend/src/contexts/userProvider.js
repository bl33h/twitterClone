import React from 'react';
import {UserContext} from "../App";

export function UserProvider({ children }) {
    const [tag, setTag] = React.useState('donald90');
    const [username, setUsername] = React.useState('jason00');

    return (
        <UserContext.Provider value={{ tag, setTag, username, setUsername }}>
            {children}
        </UserContext.Provider>
    );
}