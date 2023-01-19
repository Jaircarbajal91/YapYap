import { React, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, useHistory } from "react-router-dom";
import DemoButton from "./demoButton";

const Splash = ({ sessionUser }) => {
    // const history = useHistory();
    // const dispatch = useDispatch();


    if (sessionUser) return <Redirect to="/app" />;
    console.log(sessionUser)
    return (
        <div className="container2">
            <div className="top_section">
                <div className="top_links">
                    <DemoButton />
                </div>
            </div>
        </div>
    )
}

export default Splash;
