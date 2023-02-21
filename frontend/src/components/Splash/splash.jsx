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
            <Navbar />
            <div className="splash-wrapper">
                <img src="../../../assets/images/splash2.svg" alt="" />
                <div className="splash-message">
                    <h1 className="">IMAGINE A PLACE...</h1>
                    <p className="">...where you can belong to a school club, a gaming group, or a worldwide art community. Where just you and a handful of friends can spend time together. A place that makes it easy to talk every day and hang out more often.</p>
                    <DemoButton />
                </div>
                <img src="../../../assets/images/splash3.svg" alt="" />
            </div>
            <div className="">
            </div>
        </div>
    )
}

export default Splash;
