import React from 'react'
import './tray.scss'
import pfp from '../../assets/images/defaultPFP.jpg'

function Tray (data) {
    const {
        name,
        username,
    } = data

    return (
        <div className="tray">
            <div className={"photo"}>
                <img src={pfp} alt={"Profile"}/>
            </div>
            <div className={"info"}>
                <div className={"header"}>
                    <span id={"name"}>{data.name}</span>
                    <span id={"username"}>@{data.username}</span>
                </div>
            </div>
        </div>
    )
}

export default Tray