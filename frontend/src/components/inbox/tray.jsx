import React from 'react'
import ReactDOM from 'react-dom';
import './tray.scss'
import pfp from '../../assets/images/defaultPFP.jpg'
import {dmSVG, mutedSVG} from "../../assets/icons/icons";
import { Link } from 'react-router-dom';

function Tray({data}) {
    const {
        id,
        name,
        isdm,
        muted,
    } = data

    return (
        <Link to={`/chat/${id}`}
              style={{textDecoration: 'none', color: '#f7f9f9'}}
        >
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
        </Link>
    )
}

export default Tray