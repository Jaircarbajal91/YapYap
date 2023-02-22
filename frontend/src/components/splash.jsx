import { React, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, useHistory } from "react-router-dom";
import Navbar from "./Navbar";
import DemoButton from "./demoButton";
import { csrfFetch } from "../store/csrf";
import splash2 from "../../assets/images/splash2.svg";
import splash3 from "../../assets/images/splash3.svg";
import studyGroup from "../../assets/images/study-group.svg";
import chillin from "../../assets/images/chillin.svg";

const Splash = ({ sessionUser }) => {
  if (sessionUser) return <Redirect to="/app" />;
  return (
    <div className="top_section h-screen">
      <div className="flex flex-row justify-evenly relative items-end w-full h-4/6 bg-hero gap-x-2 bg-splash-1 bg-bottom bg-no-repeat">
        <Navbar />
        <img
          className="absolute max-w-2xl -left-5 -ml-20 z-10 w-2/5"
          src={splash2}
          alt=""
        />
        <div className="flex flex-col items-center justify-center text-center h-full w-2/5">
          <h1 className="text-white  text-5xl font-black font-header mb-10">
            IMAGINE A PLACE...
          </h1>
          <p className="text-white text-center font-sans font-normal mb-10 text-lg tracking-wide leading-loose">
            ...where you can belong to a school club, a gaming group, or a
            worldwide art community. Where just you and a handful of friends can
            spend time together. A place that makes it easy to talk every day
            and hang out more often.
          </p>
          <DemoButton />
        </div>
        <img
          className="absolute max-w-2xl -right-8 z-10 w-2/5"
          src={splash3}
          alt=""
        />
      </div>
      <section className="w-full flex justify-center py-20">
        <div className="flex justify-center items-center w-2/3">
          <img src={studyGroup} alt="" />
          <div className="flex flex-col text-offBlack w-[30%] ml-20">
            <h2 className="text-[2.4rem] font-black leading-normal tracking-wide mb-5">
              Create an invite-only place where you belong
            </h2>
            <p className="leading-8 text-[1.1rem]">
              Discord servers are organized into topic-based channels where you
              can collaborate, share, and just talk about your day without
              clogging up a group chat.
            </p>
          </div>
        </div>
      </section>
      <section className="flex justify-center w-full bg-offWhite py-20">
        <div className="flex justify-center items-center w-2/3">
          <div className="flex flex-col text-offBlack w-[30%] mr-20">
            <h2 className="text-[2.4rem] font-black leading-normal tracking-wide mb-5">
              Where hanging out is easy
            </h2>
            <p className="leading-8 text-[1.1rem]">
              Grab a seat in a voice channel when you’re free. Friends in your
              server can see you’re around and instantly pop in to talk without
              having to call.
            </p>
          </div>
          <img src={chillin} alt="" />
        </div>
      </section>
    </div>
  );
};

export default Splash;
