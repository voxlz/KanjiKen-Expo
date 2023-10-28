/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app.d.{js,jsx,ts,tsx}",
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          50: "#f3faeb",
          100: "#e5f3d4",
          200: "#cce8ae",
          300: "#abd87e",
          400: "#8bc655",
          500: "#71b139",
          600: "#538828",
          700: "#406823",
          800: "#365321",
          900: "#2f481f",
          950: "#16270c",
        },
        ui: {
          light: "#B8B8B8",
          normal: "#ECEAEA",
          disabled: "#AEAEAE",
          bold: "#727272",
          text: "#000000",
        },
        highlight: {
          gray: "#EEEEEE",
          blue: "#EEF4FA",
        },
      },
    },
  },
  plugins: [],
};
