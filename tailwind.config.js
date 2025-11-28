/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#47B88F', // mint green
        accent: '#FF9F45', // warm orange
        background: '#F8F7F4', // off-white
        neutral: '#DAD7D2', // neutral grey
        text: '#2F2E2C', // dark charcoal
        'text-secondary': '#A69F94', // soft brown-grey
        'expiring-bg': '#FFF1F1', // expiring background
        'fresh': '#65C37A', // OK / fresh indicator green
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

