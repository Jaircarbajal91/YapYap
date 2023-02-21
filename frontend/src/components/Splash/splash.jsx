import { React, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, useHistory } from "react-router-dom";
import Navbar from '../Navbar'
import DemoButton from "../demoButton";
import { csrfFetch } from "../../store/csrf";
import './splash.css'

const Splash = ({ sessionUser }) => {

    if (sessionUser) return <Redirect to="/app" />;
    return (
        <div className="splash-main-container">
            <div className="splash-wrapper">
                <Navbar />
                <img className="" alt="" />
                <div className="">
                    <h1 className="">IMAGINE A PLACE...</h1>
                    <p className="">...where you can belong to a school club, a gaming group, or a worldwide art community. Where just you and a handful of friends can spend time together. A place that makes it easy to talk every day and hang out more often.</p>
                    <DemoButton />
                </div>
                <img className="" alt="" />
            </div>
            <div className="">
            </div>
        </div>
    )
}

export default Splash;
