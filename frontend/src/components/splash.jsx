import { React, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, useHistory } from "react-router-dom";
import DemoButton from "./demoButton";
import { csrfFetch } from "../store/csrf";

const Splash = ({ sessionUser }) => {

    if (sessionUser) return <Redirect to="/app" />;
    return (
        <div className="top_section h-screen">
            <h1>hello</h1>
            <div className="flex justify-evenly items-end w-full h-4/6 bg-indigo-700 bg-[url('../../assets/svg/splash1.svg')]">
                <img className="z-10 w-3/5" src="../../assets/svg/splash2.svg" alt="" />
                <h1>Imagine a Place</h1>
                <img className="z-10 w-3/5" src="../../assets/svg/splash3.svg" alt="" />
            </div>
            <div className="top_links">
                <DemoButton />
            </div>
        </div>
    )
}

export default Splash;
