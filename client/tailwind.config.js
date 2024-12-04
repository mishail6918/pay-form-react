/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#304ac1",
        info: "#20a1ff",
        success: "#65d83c",
        error: "#ef4f39",
        grey: {
          8: "#eceff0",
          20: "#d2d5d6",
          36: "#aeb0b5",
          52: "#898e94",
          68: "#666c77",
          84: "#404a53",
          100: "#eef1f3",
          200: "#d9dee2",
          300: "#bfc6cc",
          400: "#a9b2b9",
          500: "#919ba3",
          600: "#7b858f",
          700: "#5e6a74",
          800: "#434d56",
          900: "#232c34",
          1000: "#1a2128",
        },
      },
      fontSize: {
        title: [
          "28px",
          {
            fontFamily: "Inter",
            fontWeight: 400,
            lineHeight: "1.3",
          },
        ],
        button: [
          "14px",
          {
            fontFamily: "Inter",
            fontWeight: 400,
            lineHeight: "18px",
          },
        ],
      },
    },
  },
  plugins: [],
};
