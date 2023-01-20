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
    },
    fontFamily: {
      sans: ['gg sans', 'Inter', 'sans-serif'],
      serif: ['Merriweather', 'serif'],
      header: ['Seymour One', 'sans-serif']
    },
    extend: {},

  },
  plugins: [],
}
