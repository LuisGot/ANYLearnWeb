/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {},
  },
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: "#ed9b40",
          secondary: "#f3f4f6",
          accent: "#ff00ff",
          neutral: "#1c1c1c",
          "base-100": "#121212",
          info: "#67e8f9",
          success: "#4ade80",
          warning: "#fde047",
          error: "#ef4444",
        },
      },
    ],
  },
  plugins: [require("daisyui")],
};
