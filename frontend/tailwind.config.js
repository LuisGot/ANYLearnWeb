/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}", "./public/**/*.{html,ts}"],
  theme: {
    extend: {
      fontFamily: {
        cinzel: ["Cinzel", "sans-serif"],
        "cinzel-decorative": ["Cinzel Decorative", "sans-serif"],
      },
      keyframes: {
        fadeInUp: {
          "0%": { opacity: 0, transform: "translateY(30px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        fadeInLeft: {
          "0%": { opacity: 0, transform: "translateX(-30px)" },
          "100%": { opacity: 1, transform: "translateX(0)" },
        },
      },
      animation: {
        fadeInUp: "fadeInUp 0.5s ease-out forwards",
        fadeInLeft: "fadeInLeft 0.5s ease-out forwards",
      },
    },
  },
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: "#da6308",
          secondary: "#f3f4f6",
          accent: "#121212",
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
