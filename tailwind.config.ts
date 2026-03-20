import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: {
        "2xl": "1450px",
      },
    },
    extend: {
      colors: {
        // Exact site palette
        gold: "#E7B913",
        goldHover: "#BC9404",
        goldDark: "#D1A402",
        goldDeep: "#866900",
        brandRed: "#FB3C3C",
        brandRedDark: "#CE3030",
        greenAccent: "#61CE70",
        darkBg: "#121212",
        cardBg: "#282828",
        grayText: "#7A7A7A",
        mediumGray: "#5A5A5A",
        // shadcn compatibility
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground, 0 0% 98%))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        heading: ["var(--font-heading)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      fontSize: {
        // Desktop exact sizes from the site
        "h1": ["5.125rem", { lineHeight: "1em", fontWeight: "700" }],
        "h2": ["3rem", { lineHeight: "1.1em", fontWeight: "600" }],
        "h3": ["2rem", { lineHeight: "1.1em", fontWeight: "600" }],
        "h4": ["1.625rem", { lineHeight: "1.1em", fontWeight: "600" }],
        "h5": ["1.375rem", { lineHeight: "1.1em", fontWeight: "600" }],
        "h6": ["1.063rem", { lineHeight: "1.4em", fontWeight: "500" }],
        "giant": ["15.625rem", { lineHeight: "1em", fontWeight: "700" }],
        "large-num": ["8.125rem", { lineHeight: "1em", fontWeight: "700" }],
      },
      keyframes: {
        fadeInLeft: {
          "0%": { opacity: "0", transform: "translateX(-50px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        fadeInRight: {
          "0%": { opacity: "0", transform: "translateX(50px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        bounceInUp: {
          "0%": { opacity: "0", transform: "translateY(60px)" },
          "60%": { opacity: "1", transform: "translateY(-10px)" },
          "80%": { transform: "translateY(5px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "fade-in-left": "fadeInLeft 0.8s ease-out forwards",
        "fade-in-right": "fadeInRight 0.8s ease-out forwards",
        "fade-in-up": "fadeInUp 0.8s ease-out forwards",
        "bounce-in-up": "bounceInUp 0.8s ease-out forwards",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
