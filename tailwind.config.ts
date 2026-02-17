import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#00d4ff",
          dark: "#0099cc",
          light: "#33ddff",
        },
        secondary: {
          DEFAULT: "#7c3aed",
          dark: "#5b21b6",
          light: "#a78bfa",
        },
        accent: {
          DEFAULT: "#ff006e",
          dark: "#cc0058",
          light: "#ff3385",
        },
        background: "#0a0e27",
        surface: "#151d3b",
        "text-primary": "#ffffff",
        "text-secondary": "#a0aec0",
        success: "#00ff88",
        warning: "#fbbf24",
        error: "#ff4757",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-1": "linear-gradient(135deg, #00d4ff 0%, #7c3aed 100%)",
        "gradient-2": "linear-gradient(135deg, #7c3aed 0%, #ff006e 100%)",
        "gradient-hero": "linear-gradient(180deg, #0a0e27 0%, #1a1f3a 50%, #0a0e27 100%)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.5s ease-out",
        "float": "float 6s ease-in-out infinite",
        "pulse-glow": "pulseGlow 3s ease-in-out infinite",
        "lightning-1": "lightningStrike1 6s ease-in-out infinite",
        "lightning-2": "lightningStrike2 5.5s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.3", transform: "translate(-50%, -50%) scale(1)" },
          "50%": { opacity: "0.6", transform: "translate(-50%, -50%) scale(1.2)" },
        },
        lightningStrike1: {
          "0%, 4%": { opacity: "0" },
          "4%": { opacity: "0.9" },
          "5%": { opacity: "0.5" },
          "6%": { opacity: "1" },
          "7%": { opacity: "0.2" },
          "8%, 100%": { opacity: "0" },
        },
        lightningStrike2: {
          "0%, 11%": { opacity: "0" },
          "11%": { opacity: "1" },
          "12%": { opacity: "0.4" },
          "13%": { opacity: "0.95" },
          "14%": { opacity: "0.1" },
          "15%, 100%": { opacity: "0" },
        },
      },
      boxShadow: {
        "glow-primary": "0 0 30px rgba(0, 212, 255, 0.3)",
        "glow-secondary": "0 0 30px rgba(124, 58, 237, 0.3)",
        "glow-accent": "0 0 30px rgba(255, 0, 110, 0.3)",
        "card": "0 10px 40px rgba(0, 0, 0, 0.3)",
        "card-hover": "0 20px 60px rgba(0, 212, 255, 0.2)",
      },
    },
  },
  plugins: [],
};

export default config;

