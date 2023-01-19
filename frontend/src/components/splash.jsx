import { React, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, useHistory } from "react-router-dom";
import DemoButton from "./demoButton";
import { csrfFetch } from "../store/csrf";

const Splash = ({ sessionUser }) => {
    // const history = useHistory();
    // const dispatch = useDispatch();

    // get current user using csrfFetch
    // useEffect(() => {
    //     const fetchUser = async () => {
    //         const res = await csrfFetch("/api/servers/");
    //         const data = await res.json();
    //         console.log(data);
    //     };
    //     fetchUser();
    // }, []);




    if (sessionUser) return <Redirect to="/app" />;
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
