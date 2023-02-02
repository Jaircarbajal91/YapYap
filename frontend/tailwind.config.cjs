/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      sm: '480px',
      md: '768px',
      lg: '976px',
      xl: '1440px',
    },
    colors: {
      demoButton: "#23272A",
      demoButtonHover: "#36393F",
      hero: '#404EED',
      white: '#FFFFFF',
      black: '#000000',
      gray: '#36393F',
      lightGray: '#ABACB0',
      darkGray: '#212225',
      lightRed: '#ED4346',
      torqoise: '#0AACEF',
      navy: '#4853C6',
      yellow: '#FFC61A',
    },
    fontFamily: {
      sans: ['gg sans', 'Inter', 'sans-serif'],
      serif: ['Merriweather', 'serif'],
      header: ['Seymour One', 'sans-serif']
    },
  },
  plugins: [],
}
