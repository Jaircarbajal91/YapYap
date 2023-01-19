import { React, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, useHistory } from "react-router-dom";
import DemoButton from "./demoButton";

const Splash = () => {
    // const history = useHistory();
    // const dispatch = useDispatch();
    const sessionUser = useSelector(state => state.session.user);

    if (sessionUser) return <Redirect to="/app" />;

    return (
        <div className="container">
            <div className="top_section">
                <div className="top_links">
                    <DemoButton />
                </div>
            </div>
        </div>
    )
}

export default Splash;
