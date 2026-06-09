import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Cyan-mapped brand for futuristic dark theme
        brand: {
          50:  "#E0FBFF",
          100: "#B5F4FF",
          200: "#7FEBFF",
          400: "#33E0FF",
          500: "#00F0FF",
          600: "#00C8DA",
          700: "#0099A8",
          900: "#003B43",
        },
        // New futuristic palette
        ink:     "#05060A",
        ink2:    "#0B0E18",
        ink3:    "#131726",
        wire:    "#2A3554",
        paper:   "#E8ECFF",
        chrome:  "#8A93B8",
        cyan:    "#00F0FF",
        magenta: "#B026FF",
        lime:    "#C4FF00",
        klein:   "#B026FF",
        canary:  "#C4FF00",
        mint:    "#00FF94",
      },
      fontFamily: {
        display: ["Space Grotesk", "Inter", "sans-serif"],
        body:    ["Inter", "Helvetica Neue", "sans-serif"],
        mono:    ["JetBrains Mono", "Space Mono", "monospace"],
        sans:    ["Inter", "Helvetica Neue", "sans-serif"],
        serif:   ["Italiana", "Times New Roman", "serif"],
      },
      borderRadius: {
        none: "0px",
        sm:   "4px",
        md:   "6px",
        lg:   "10px",
        xl:   "14px",
        "2xl":"18px",
        "3xl":"22px",
        full: "9999px",
      },
      animation: {
        "fade-up": "fadeUp .65s cubic-bezier(.2,.8,.2,1) both",
        "ticker":  "ticker-scroll 36s linear infinite",
        "glow-pulse": "glowPulse 2.4s ease-in-out infinite",
      },
      keyframes: {
        fadeUp: {
          from: { opacity: "0", transform: "translateY(24px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        "ticker-scroll": {
          from: { transform: "translateX(0)" },
          to:   { transform: "translateX(-50%)" },
        },
        glowPulse: {
          "0%,100%": { opacity: "0.6" },
          "50%":     { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
