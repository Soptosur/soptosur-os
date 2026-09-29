import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        nsu: {
          navy: "#0F1E36",
          dark: "#0B132B",
          slate: "#1E293B",
          card: "#162238",
          blue: "#1D4ED8",
          sky: "#0284C7",
          gold: "#D97706",
          amber: "#F59E0B",
          emerald: "#059669",
          crimson: "#DC2626",
          light: "#F8FAFC",
        },
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
        card: "0 4px 20px -2px rgba(15, 23, 42, 0.25)",
      },
    },
  },
  plugins: [],
};

export default config;
