export default {
  darkMode: "class",   // IMPORTANT
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#1e2a44",
        secondary: "#418dbe",
        darkbg: "#0f172a",
        lightbg: "#f8fafc",
        cream: "#fdf7f0",
      }
    },
     fontFamily: {
      sans: ["Inter", "sans-serif"],
    },
  },
  plugins: [],
};
