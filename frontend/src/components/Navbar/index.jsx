import { useState } from "react";
import { useHistory } from "react-router-dom";
import yapyap from "../../../assets/images/yapyap.svg";
import yapyapLogo from "../../../assets/images/yapyapLogo.svg";

const Navbar = () => {
  const history = useHistory();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleNavigate = (path) => {
    setIsMenuOpen(false);
    history.push(path);
  };

  return (
    <nav className="fixed top-0 left-0 z-40 w-full">
      <div className="mx-auto flex max-w-6xl items-center justify-between rounded-b-3xl border border-transparent border-b-borderMuted/40 bg-hero-gradient/90 px-6 py-3 shadow-glow backdrop-blur-xl transition-colors duration-300">
        <div
          className="flex cursor-pointer items-center gap-3"
          onClick={() => handleNavigate("/")}
        >
          <img className="w-10 drop-shadow-md" src={yapyap} alt="YapYap symbol" />
          <img
            className="hidden w-24 drop-shadow-md sm:block"
            src={yapyapLogo}
            alt="YapYap logotype"
          />
        </div>
        <div className="hidden items-center gap-3 sm:flex">
          <button
            onClick={() => handleNavigate("/register")}
            className="rounded-full border border-white/25 bg-white/10 px-5 py-2 text-sm font-semibold uppercase tracking-wide text-white shadow-inner-card transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/90 hover:text-hero focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
          >
            Register
          </button>
          <button
            onClick={() => handleNavigate("/login")}
            className="rounded-full bg-white px-5 py-2 text-sm font-semibold uppercase tracking-wide text-black shadow-soft-card transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
          >
            Login
          </button>
        </div>
        <button
          className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-white shadow-inner-card transition-all duration-200 active:scale-95 sm:hidden"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          aria-label="Toggle navigation menu"
        >
          <span className="sr-only">Open menu</span>
          <div className="flex flex-col items-center justify-center gap-1.5">
            {[0, 1, 2].map((line) => (
              <span
                key={line}
                className={`h-[2px] w-6 rounded-full bg-white transition-transform duration-200 ${
                  isMenuOpen && line === 0 ? "translate-y-[7px] rotate-45" : ""
                } ${
                  isMenuOpen && line === 1 ? "opacity-0" : ""
                } ${
                  isMenuOpen && line === 2 ? "-translate-y-[7px] -rotate-45" : ""
                }`}
              />
            ))}
          </div>
        </button>
      </div>
      <div
        className={`sm:hidden transition-opacity duration-200 ${
          isMenuOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div className="mx-6 mt-2 overflow-hidden rounded-3xl border border-white/10 bg-surface/90 shadow-soft-card backdrop-blur-xl">
          <button
            onClick={() => handleNavigate("/register")}
            className="w-full px-6 py-4 text-left text-sm font-semibold uppercase tracking-wide text-white transition-colors duration-200 hover:bg-accentSoft hover:text-white/90"
          >
            Register
          </button>
          <button
            onClick={() => handleNavigate("/login")}
            className="w-full border-t border-white/10 px-6 py-4 text-left text-sm font-semibold uppercase tracking-wide text-white transition-colors duration-200 hover:bg-accentSoft hover:text-white/90"
          >
            Login
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
