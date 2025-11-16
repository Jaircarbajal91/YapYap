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
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-24 px-6 pb-24 pt-32 md:pt-36">
        <section className="relative grid gap-14 md:grid-cols-[1.1fr_0.9fr] md:items-center">
          <div className="flex flex-col items-center gap-8 text-center md:items-start md:text-left">
            <span className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate shadow-inner-card">
              built for real connection
            </span>
            <h1 className="font-display text-4xl font-black leading-[1.05] tracking-tight text-offWhite drop-shadow lg:text-[3.5rem]">
              A digital hangout that feels like home.
            </h1>
            <p className="max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">
              Welcome to YapYap—your space to talk, share, and stay close with the people who matter.
              Organize conversations, hop into calls, and create the community you wish existed.
            </p>
            <div className="flex w-full flex-col justify-start gap-4 sm:flex-row">
              <button
                onClick={() => history.push("/register")}
                className="w-full rounded-full bg-white px-6 py-3 text-base font-semibold text-hero shadow-soft-card transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/90 hover:text-hero focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 sm:w-auto"
              >
                Start your server
              </button>
              <div className="w-full sm:w-auto">
                <DemoButton />
              </div>
            </div>
            <div className="grid w-full gap-4 rounded-3xl border border-white/10 bg-surface/80 p-6 backdrop-blur-xl shadow-soft-card md:max-w-xl">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accentSoft text-lg font-semibold text-accent shadow-inner-card">
                  01
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.25em] text-slate">
                    Always in sync
                  </p>
                  <p className="text-base text-white/85">
                    Messages, voice, and media update in real time—no refresh needed.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-successSoft text-lg font-semibold text-serverGreen shadow-inner-card">
                  02
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.25em] text-slate">
                    Ready anywhere
                  </p>
                  <p className="text-base text-white/85">
                    Designed for desktop and mobile—switch devices without missing a beat.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="relative mx-auto flex w-full max-w-md flex-col items-center gap-8 md:max-w-xl md:items-end">
            <div className="pointer-events-none absolute -top-6 -left-10 h-40 w-40 rounded-full bg-accentSoft blur-3xl" />
            <img
              className="relative z-10 w-full max-w-sm rounded-[2.5rem] border border-white/10 bg-surface/70 p-8 shadow-soft-card backdrop-blur-xl md:max-w-lg"
              src={splash2}
              alt="Community illustration"
            />
            <img
              className="relative z-0 w-full max-w-[14rem] rounded-[2rem] border border-white/10 bg-surfaceLight/80 p-5 shadow-soft-card backdrop-blur-lg sm:max-w-[16rem] md:max-w-[18rem] md:self-start md:translate-x-6"
              src={splash3}
              alt="Friends illustration"
            />
          </div>
        </section>

        <section className="relative">
          <div className="absolute inset-0 -z-10 rounded-[3rem] bg-surfaceLight/40 blur-3xl" />
          <div className="grid gap-10 rounded-[2.5rem] border border-white/10 bg-surface/70 p-10 backdrop-blur-xl shadow-soft-card md:grid-cols-3">
            {featureCards.map((card) => (
              <article
                key={card.id}
                className="flex h-full flex-col gap-6 rounded-3xl border border-white/5 bg-surfaceMuted/50 p-6 shadow-inner-card transition-transform duration-200 hover:-translate-y-2 hover:shadow-glow"
              >
                <img
                  className="w-full rounded-2xl border border-white/5 bg-surfaceLight/70 p-6"
                  src={card.image}
                  alt={card.title}
                />
                <div className="space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate">
                    {card.eyebrow}
                  </p>
                  <h2 className="text-2xl font-semibold text-offWhite">{card.title}</h2>
                  <p className="text-base leading-relaxed text-white/75">{card.description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-12 rounded-[2.5rem] border border-white/10 bg-surfaceLight/70 p-10 text-center backdrop-blur-xl shadow-soft-card md:grid-cols-[0.9fr_1.1fr] md:text-left">
          <div className="flex flex-col gap-6 justify-center">
            <span className="inline-flex w-fit items-center rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-slate shadow-inner-card">
              reliable tech
            </span>
            <h2 className="font-display text-3xl font-bold leading-tight text-offWhite md:text-4xl">
              Low-latency voice & video that just works—no downloads required.
            </h2>
            <p className="text-base leading-relaxed text-white/75">
              Wave hello on video, watch streams together, or co-create in real time. YapYap keeps
              you close with high fidelity voice and collaborative tools that work seamlessly on any
              device.
            </p>
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
              <button
                className="w-full rounded-full border border-white/20 bg-transparent px-6 py-3 text-base font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 sm:w-auto"
                onClick={() => history.push("/login")}
              >
                Jump back in
              </button>
              <button
                className="w-full rounded-full bg-navy px-6 py-3 text-base font-semibold text-white shadow-soft-card transition-all duration-200 hover:-translate-y-0.5 hover:bg-hero focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:w-auto"
                onClick={() => history.push("/register")}
              >
                Create your account
              </button>
            </div>
          </div>
          <div className="relative flex flex-col items-center gap-8">
            <img
              className="w-full max-w-lg rounded-[2.75rem] border border-white/10 bg-surface/80 p-6 shadow-soft-card backdrop-blur-xl"
              src={reliable}
              alt="Reliable tech illustration"
            />
            <img
              className="w-56 max-w-sm -translate-y-6 drop-shadow-2xl"
              src={stars}
              alt="Stars accent"
            />
          </div>
        </section>

        <section className="relative overflow-hidden rounded-[2.75rem] border border-white/10 bg-hero-gradient/80 px-8 py-16 text-center shadow-glow backdrop-blur-xl">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.22),transparent_60%)]" />
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-6">
            <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-5 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-white/90">
              ready when you are
            </span>
            <h2 className="font-display text-3xl font-bold leading-tight text-white md:text-4xl">
              Your next favourite place on the internet is just a click away.
            </h2>
            <p className="text-base leading-relaxed text-white/85 md:text-lg">
              Build a space that reflects your community’s vibe. Start with pre-made templates or
              customize everything—you decide how you want people to connect.
            </p>
            <button
              className="rounded-full bg-white px-8 py-3 text-base font-semibold text-hero transition-transform duration-200 hover:-translate-y-1 hover:bg-white/95 hover:text-heroDark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
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
