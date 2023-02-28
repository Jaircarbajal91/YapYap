/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{html,js,jsx}"
  ],
  theme: {
    backgroundImage: {
      'login-bg': "url('../assets/images/login.svg')",
      'splash-1': "url('../assets/images/splash1.svg')",
    },
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
      gray: '#575A61',
      lightGray: '#ABACB0',
      midGray: '#2A2D30',
      darkGray: '#212225',
      serverBg: '#1E1E22',
      channelBg: '#2A2D31',
      chatBg: '#303338',
      serverGreen: '#23A55A',
      lightRed: '#ED4346',
      torqoise: '#0AACEF',
      navy: '#4853C6',
      yellow: '#FFC61A',
      offBlack: '#23272A',
      offWhite: '#F6F6F6'
    },
    fontFamily: {
      sans: ['gg sans', 'Inter', 'sans-serif'],
      serif: ['Merriweather', 'serif'],
      header: ['Seymour One', 'sans-serif']
    },
  },
  plugins: [],
}
