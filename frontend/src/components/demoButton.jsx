import React from "react";
import { useDispatch } from "react-redux";
import { Redirect, useHistory } from "react-router-dom";
import { login } from "../store/session";

const DemoButton = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const handleDemo = async e => {
        e.preventDefault();
        await dispatch(login({credential: "Demo_User", password: "password"}));
        return <Redirect to="app" />;
    }

    return (
        <button onClick={handleDemo}>Demo</button>
    )
}

export default DemoButton;
