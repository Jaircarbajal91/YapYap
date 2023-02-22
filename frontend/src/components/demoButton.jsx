import React from "react";
import { useDispatch } from "react-redux";
import { Redirect } from "react-router-dom";
import { login } from "../store/session";

const DemoButton = () => {
    const dispatch = useDispatch();
    const handleDemo = async e => {
        e.preventDefault();
        await dispatch(login({credential: "Demo_User", password: "password"}));
        return <Redirect to="/app" />;
    }

    return (
        <button className="demo-button" onClick={handleDemo}>Demo Login</button>
    )
}

export default DemoButton;
