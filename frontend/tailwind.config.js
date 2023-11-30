/** @type {import('tailwindcss').Config} */

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],

  theme: {
    extend: {
      screens: {
        home: "52rem"
      },
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
        "alert-80": "#dc807a",
        "alert-30": "#efcfcd",
        "alert-10": "#faefee",

        "grayscale-black": "#000000",
        "grayscale-darkgray": "#595959",
        "grayscale-gray": "#b3b3b3",
        "grayscale-lightgray": "#e6e6e6",
        "grayscale-white": "#ffffff",

        "pen-red": "#DF5536",
        "pen-yellow": "#F2C947",
        "pen-forsythia": "#FCF467",
        "pen-lightgreen": "#D3E660",
        "pen-blue": "#5099E9",
        "pen-border-red": "#BB452A",
        "pen-border-yellow": "#C5A339",
        "pen-border-forsythia": "#BDB74D",
        "pen-border-lightgreen": "#A1AF4B",
        "pen-border-blue": "#3D76B5",

        "memo-red": "#FB9B86",
        "memo-yellow": "#FEE490",
        "memo-forsythia": "#FEFAAC",
        "memo-lightgreen": "#EBFA8E",
        "memo-blue": "#AAD3FF",
        "memo-border-red": "#DF5536",
        "memo-border-yellow": "#F2C947",
        "memo-border-forsythia": "#FCF467",
        "memo-border-lightgreen": "#D3E660",
        "memo-border-blue": "#5099E9"
      }
    }
  },
  plugins: []
};
