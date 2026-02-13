// tailwind.config.js
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
      },
      fontSize: {
        navbar: "24px",
        table_title: "32px",
      },
      colors: {
        primary: {
          100: "#555555", // Lighter gray
          200: "#454545", // Medium light gray
          300: "#353535", // Medium gray
          400: "#272727",
          500: "#252525", // Main primary color
        },
      },
      textColor: {
        // Custom text colors
        default: "#FFFFFF", // gray-800
        muted: "#e3e3e3", // gray-500
      },
    },
  },
  plugins: [],
};
