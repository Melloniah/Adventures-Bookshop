// tailwind.config.js
module.exports = {
  content: [
     "./app/**/*.{js,ts,jsx,tsx}",       // all files in app folder
    "./components/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
    "./store/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};