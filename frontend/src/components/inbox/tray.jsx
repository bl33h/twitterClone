import React from 'react'
import ReactDOM from 'react-dom';
import './tray.scss'
import pfp from '../../assets/images/defaultPFP.jpg'
import {dmSVG, mutedSVG} from "../../assets/icons/icons";

function Tray({data}) {
    const {
        id,
        name,
        isdm,
        muted,
    } = data

    const handleTrayClick = () => {
        const newWindow = window.open(`http://localhost:3000/chat/${id}`, '_blank');
        const newRoot = newWindow.document.createElement('div');
        newWindow.document.body.appendChild(newRoot);
        ReactDOM.render(<p>Hola</p>, newRoot);
    }

    console.log(data)

    return (
        <div className="tray" onClick={handleTrayClick}>
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