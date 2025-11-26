import React from "react";
import { Redirect, useHistory } from "react-router-dom";
import Navbar from "./Navbar";
import DemoButton from "./demoButton";
import splash2 from "../../assets/images/splash2.svg";
import splash3 from "../../assets/images/splash3.svg";
import studyGroup from "../../assets/images/study-group.svg";
import chillin from "../../assets/images/chillin.svg";
import fandom from "../../assets/images/fandom.svg";
import reliable from "../../assets/images/reliable.svg";
import stars from "../../assets/images/stars.svg";

const featureCards = [
  {
    id: 1,
    eyebrow: "Personal Spaces",
    title: "Invite-only communities that feel alive",
    description:
      "Spin up focused channels and curated spaces for every group, team, or hobby. Keep conversations flowing without losing the casual vibe.",
    image: studyGroup,
  },
  {
    id: 2,
    eyebrow: "Seamless Presence",
    title: "Drop in, vibe out, stay connected effortlessly",
    description:
      "Voice lounges, status pings, and quick reactions make it easy to see who's around and jump right into the moment—no scheduling required.",
    image: chillin,
  },
  {
    id: 3,
    eyebrow: "Scale with energy",
    title: "From a handful of friends to a thriving fandom",
    description:
      "Give your members room to grow with moderation tools, roles, and powerful customization that scales with your community.",
    image: fandom,
  },
];

const Splash = ({ sessionUser }) => {
  if (sessionUser) return <Redirect to="/app" />;
  const history = useHistory();

  return (
    <div className="relative min-h-screen w-full bg-transparent text-white">
      <Navbar />
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 pb-12 pt-20 sm:gap-12 sm:px-6 sm:pb-16 sm:pt-24 md:gap-16 md:pb-20 md:pt-28 lg:gap-24 lg:pb-24 lg:pt-32">
        <section className="relative grid gap-6 sm:gap-8 md:gap-12 lg:gap-14 md:grid-cols-[1.1fr_0.9fr] md:items-center">
          <div className="flex flex-col items-center gap-6 text-center md:items-start md:text-left sm:gap-8">
            <span className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate shadow-inner-card sm:px-4 sm:text-xs">
              built for real connection
            </span>
            <h1 className="font-display text-2xl font-black leading-[1.1] tracking-tight text-offWhite drop-shadow sm:text-3xl md:text-4xl lg:text-[3.5rem]">
              A digital hangout that feels like home.
            </h1>
            <p className="max-w-xl text-sm leading-relaxed text-white/80 sm:text-base md:text-lg">
              Welcome to YapYap—your space to talk, share, and stay close with the people who matter.
              Organize conversations, hop into calls, and create the community you wish existed.
            </p>
            <div className="flex w-full flex-col justify-start gap-3 sm:flex-row sm:gap-4">
              <button
                onClick={() => history.push("/register")}
                className="w-full rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-hero shadow-soft-card transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/90 hover:text-hero focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 active:scale-95 sm:w-auto sm:px-6 sm:py-3 sm:text-base"
              >
                Start your server
              </button>
              <div className="w-full sm:w-auto">
                <DemoButton />
              </div>
            </div>
            <div className="grid w-full gap-3 rounded-2xl border border-white/10 bg-surface/80 p-4 backdrop-blur-xl shadow-soft-card sm:gap-4 sm:rounded-3xl sm:p-6 md:max-w-xl">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accentSoft text-base font-semibold text-accent shadow-inner-card sm:h-12 sm:w-12 sm:rounded-2xl sm:text-lg">
                  01
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-slate sm:text-sm">
                    Always in sync
                  </p>
                  <p className="text-sm text-white/85 sm:text-base">
                    Messages, voice, and media update in real time—no refresh needed.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-successSoft text-base font-semibold text-serverGreen shadow-inner-card sm:h-12 sm:w-12 sm:rounded-2xl sm:text-lg">
                  02
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-slate sm:text-sm">
                    Ready anywhere
                  </p>
                  <p className="text-sm text-white/85 sm:text-base">
                    Designed for desktop and mobile—switch devices without missing a beat.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="relative mx-auto flex w-full max-w-md flex-col items-center gap-6 sm:gap-8 md:max-w-xl md:items-end">
            <div className="pointer-events-none absolute -top-4 -left-6 h-32 w-32 rounded-full bg-accentSoft blur-3xl sm:-top-6 sm:-left-10 sm:h-40 sm:w-40" />
            <img
              className="relative z-10 w-full max-w-xs rounded-[2rem] border border-white/10 bg-surface/70 p-6 shadow-soft-card backdrop-blur-xl sm:max-w-sm sm:rounded-[2.5rem] sm:p-8 md:max-w-lg"
              src={splash2}
              alt="Community illustration"
            />
            <img
              className="relative z-0 w-full max-w-[12rem] rounded-[1.5rem] border border-white/10 bg-surfaceLight/80 p-4 shadow-soft-card backdrop-blur-lg sm:max-w-[14rem] sm:rounded-[2rem] sm:p-5 md:max-w-[16rem] lg:max-w-[18rem] md:self-start md:translate-x-6"
              src={splash3}
              alt="Friends illustration"
            />
          </div>
        </section>

        <section className="relative">
          <div className="absolute inset-0 -z-10 rounded-[2rem] bg-surfaceLight/40 blur-3xl sm:rounded-[3rem]" />
          <div className="grid w-full gap-4 rounded-xl border border-white/10 bg-surface/70 p-4 backdrop-blur-xl shadow-soft-card sm:gap-6 sm:rounded-2xl sm:p-6 md:grid-cols-3 md:gap-8 md:rounded-3xl md:p-8 lg:gap-10 lg:rounded-[2.5rem] lg:p-10">
            {featureCards.map((card) => (
              <article
                key={card.id}
                className="flex h-full flex-col gap-3 rounded-xl border border-white/5 bg-surfaceMuted/50 p-3 shadow-inner-card transition-transform duration-200 hover:-translate-y-1 hover:shadow-glow active:scale-[0.98] sm:gap-4 sm:rounded-2xl sm:p-4 md:hover:-translate-y-2 md:gap-6 md:rounded-3xl md:p-6"
              >
                <img
                  className="w-full rounded-xl border border-white/5 bg-surfaceLight/70 p-4 sm:rounded-2xl sm:p-6"
                  src={card.image}
                  alt={card.title}
                />
                <div className="space-y-2 sm:space-y-3">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-slate sm:text-xs">
                    {card.eyebrow}
                  </p>
                  <h2 className="text-lg font-semibold text-offWhite sm:text-xl md:text-2xl">{card.title}</h2>
                  <p className="text-sm leading-relaxed text-white/75 sm:text-base">{card.description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-8 rounded-2xl border border-white/10 bg-surfaceLight/70 p-6 text-center backdrop-blur-xl shadow-soft-card sm:gap-10 sm:rounded-3xl sm:p-8 md:grid-cols-[0.9fr_1.1fr] md:gap-12 md:text-left md:rounded-[2.5rem] md:p-10">
          <div className="flex flex-col gap-4 justify-center sm:gap-6">
            <span className="inline-flex w-fit mx-auto md:mx-0 items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-slate shadow-inner-card sm:px-4 sm:text-xs">
              reliable tech
            </span>
            <h2 className="font-display text-2xl font-bold leading-tight text-offWhite sm:text-3xl md:text-4xl">
              Low-latency voice & video that just works—no downloads required.
            </h2>
            <p className="text-sm leading-relaxed text-white/75 sm:text-base">
              Wave hello on video, watch streams together, or co-create in real time. YapYap keeps
              you close with high fidelity voice and collaborative tools that work seamlessly on any
              device.
            </p>
            <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-start sm:gap-4">
              <button
                className="w-full rounded-full border border-white/20 bg-transparent px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 active:scale-95 sm:w-auto sm:px-6 sm:py-3 sm:text-base"
                onClick={() => history.push("/login")}
              >
                Jump back in
              </button>
              <button
                className="w-full rounded-full bg-navy px-5 py-2.5 text-sm font-semibold text-white shadow-soft-card transition-all duration-200 hover:-translate-y-0.5 hover:bg-hero focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary active:scale-95 sm:w-auto sm:px-6 sm:py-3 sm:text-base"
                onClick={() => history.push("/register")}
              >
                Create your account
              </button>
            </div>
          </div>
          <div className="relative flex flex-col items-center gap-6 sm:gap-8">
            <img
              className="w-full max-w-sm rounded-2xl border border-white/10 bg-surface/80 p-4 shadow-soft-card backdrop-blur-xl sm:max-w-md sm:rounded-3xl sm:p-6 md:max-w-lg md:rounded-[2.75rem]"
              src={reliable}
              alt="Reliable tech illustration"
            />
            <img
              className="w-40 max-w-xs -translate-y-4 drop-shadow-2xl sm:w-56 sm:-translate-y-6"
              src={stars}
              alt="Stars accent"
            />
          </div>
        </section>

        <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-hero-gradient/80 px-6 py-12 text-center shadow-glow backdrop-blur-xl sm:rounded-3xl sm:px-8 sm:py-14 md:rounded-[2.75rem] md:px-8 md:py-16">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.22),transparent_60%)]" />
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 sm:gap-6">
            <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-white/90 sm:px-5 sm:text-xs">
              ready when you are
            </span>
            <h2 className="font-display text-2xl font-bold leading-tight text-white sm:text-3xl md:text-4xl">
              Your next favourite place on the internet is just a click away.
            </h2>
            <p className="text-sm leading-relaxed text-white/85 sm:text-base md:text-lg">
              Build a space that reflects your community's vibe. Start with pre-made templates or
              customize everything—you decide how you want people to connect.
            </p>
            <button
              className="rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-hero transition-transform duration-200 hover:-translate-y-1 hover:bg-white/95 hover:text-heroDark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 active:scale-95 sm:px-8 sm:py-3 sm:text-base"
              onClick={() => history.push("/register")}
            >
              Register for free
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Splash;
