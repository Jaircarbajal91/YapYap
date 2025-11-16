/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./index.html", "./src/**/*.{html,js,jsx}"],
  theme: {
    extend: {
      backgroundImage: {
        "login-bg": "url('../assets/images/login.svg')",
        "splash-1": "url('../assets/images/splash1.svg')",
        "hero-gradient":
          "linear-gradient(135deg, rgba(88,101,242,0.95) 0%, rgba(72,83,198,0.95) 100%)",
        "glass-gradient":
          "linear-gradient(145deg, rgba(48,51,56,0.85) 0%, rgba(35,39,42,0.6) 100%)",
      },
      boxShadow: {
        glow: "0 20px 45px rgba(64,78,237,0.35)",
        "soft-card": "0 18px 40px rgba(17, 24, 39, 0.35)",
        "inner-card": "inset 0 1px 0 rgba(255,255,255,0.05)",
      },
      ringWidth: {
        6: "6px",
      },
      ringColor: {
        primary: "rgba(88,101,242,0.45)",
      },
      screens: {
        xs: "360px",
      },
    },
    screens: {
      sm: "480px",
      md: "768px",
      lg: "976px",
      xl: "1440px",
    },
    colors: {
      demoButton: "#23272A",
      demoButtonHover: "#36393F",
      hero: "#404EED",
      heroDark: "#3039B1",
      white: "#FFFFFF",
      black: "#000000",
      gray: "#575A61",
      lightGray: "#ABACB0",
      slate: "#94A3B8",
      midGray: "#2A2D30",
      darkGray: "#212225",
      serverBg: "#1E1E22",
      channelBg: "#2A2D31",
      chatBg: "#303338",
      surface: "#1B1F2A",
      surfaceLight: "#252B3B",
      surfaceMuted: "#2F3547",
      borderMuted: "#363B4A",
      serverGreen: "#23A55A",
      lightRed: "#ED4346",
      torqoise: "#0AACEF",
      navy: "#4853C6",
      yellow: "#FFC61A",
      offBlack: "#23272A",
      offWhite: "#F6F6F6",
      accent: "#7C3AED",
      accentSoft: "rgba(124,58,237,0.15)",
      successSoft: "rgba(35,165,90,0.12)",
    },
    fontFamily: {
      sans: ["gg sans", "Inter", "sans-serif"],
      serif: ["Merriweather", "serif"],
      header: ["Seymour One", "sans-serif"],
      display: ["Space Grotesk", "Inter", "sans-serif"],
    },
  },
  plugins: [],
};
