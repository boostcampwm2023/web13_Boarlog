/** @type {import('tailwindcss').Config} */

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],

  theme: {
    extend: {
      fontFamily: {
        pretendard: ["Pretendard Variable", "sans"]
      },
      fontSize: {
        "size-260": "16.25rem",
        "size-64": "4rem",
        "size-32": "2rem",
        "size-20": "1.25rem",
        "size-18": "1.125rem",
        "size-16": "1rem",
        "size-12": "0.75rem"
      },
      fontWeight: {
        bold: "700",
        semibold: "600",
        medium: "500"
      },
      colors: {
        "boarlog-100": "#4f4ffb",
        "boarlog-80": "#7272fc",
        "boarlog-30": "#cbcbfe",
        "boarlog-10": "#eeeeff",
        "alert-100": "#fb4f4f",
        "grayscale-black": "#000000",
        "grayscale-darkgray": "#595959",
        "grayscale-gray": "#b3b3b3",
        "grayscale-lightgray": "#e6e6e6",
        "grayscale-white": "#ffffff"
      }
    }
  },
  plugins: []
};
