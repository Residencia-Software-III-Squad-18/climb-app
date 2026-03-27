export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["DM Sans", "sans-serif"],
      },
      colors: {
        primary: "#2BBFA4",
        "dark-bg": "#0E1822",
        "light-bg": "#ffffff",
        "dark-text": "#ffffff",
        "light-text": "#0F1B2D",
      },
    },
  },
  darkMode: "class",
  plugins: [],
};
