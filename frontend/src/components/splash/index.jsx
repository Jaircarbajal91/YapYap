import { React, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, useHistory } from "react-router-dom";
import { login } from "../../store/session";
import "./splash.css"

const Splash = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const sessionUser = useSelector(state => state.session.user);
    const handleDemo = async e => {
        e.preventDefault();
        await dispatch(login({credential: "Demo_User", password: "password"}));
        history.push("/app");
    }

    if (sessionUser) return <Redirect to="/app" />;

    return (
        <div className="container">
            <div className="top_section">
                <div className="top_links">
                    <button onClick={handleDemo} id="demo_button">
                        Demo
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Splash;
