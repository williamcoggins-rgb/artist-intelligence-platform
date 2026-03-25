import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#FFFCE6",
          100: "#FFF9B3",
          200: "#FFF580",
          300: "#FFF04D",
          400: "#FFE600",
          500: "#FFE600",
          600: "#E6CF00",
          700: "#CCB800",
          800: "#B3A100",
          900: "#998A00",
        },
        accent: {
          DEFAULT: "#2400FF",
          light: "#4D33FF",
          dark: "#1A00CC",
        },
        surface: {
          black: "#000000",
          dark: "#0A0A0A",
          gray: "#F0F0F0",
          white: "#FFFFFF",
        },
      },
      fontFamily: {
        display: ['"Barlow Condensed"', "sans-serif"],
        body: ['"Space Grotesk"', "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
