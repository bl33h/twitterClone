import React from 'react';
import {UserContext} from "../App";

export function UserProvider({ children }) {
    const [tag, setTag] = React.useState('erikhernandez');
    const [username, setUsername] = React.useState('cjohnson');

    return (
        <UserContext.Provider value={{ tag, setTag, username, setUsername }}>
            {children}
        </UserContext.Provider>
    );
}