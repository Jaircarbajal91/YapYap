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
        <button
            className="w-full rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/20 sm:w-auto"
            onClick={handleDemo}
        >
            Demo login
        </button>
    )
}

export default DemoButton;
