import React from 'react'
import './tray.scss'
import pfp from '../../assets/images/defaultPFP.jpg'
import {dmSVG, mutedSVG} from "../../assets/icons/icons";

function Tray({data}) {
    const {
        name,
        isdm,
        muted,
    } = data

    console.log(data)

    return (
        <div className="tray">
            <div className={"photo"}>
                <img src={pfp} alt={"Profile"}/>
            </div>
            <div className={"info"}>
                <div className={"header"}>
                    <span id={"name"}>{data.name}</span>
                    {isdm && <span id={"dm"}>{dmSVG}</span>}
                    {muted && <span id={"muted"}>{mutedSVG}</span>}
                </div>
            </div>
        </div>
    )
}

export default Tray