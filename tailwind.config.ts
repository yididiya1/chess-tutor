import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        cinzel:   ["var(--font-cinzel)",   "serif"],
        rajdhani: ["var(--font-rajdhani)", "sans-serif"],
        exo2:     ["var(--font-exo2)",     "sans-serif"],
      },
      colors: {
        // semantic tokens from CSS variables
        border:     "hsl(var(--border))",
        input:      "hsl(var(--input))",
        ring:       "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT:    "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT:    "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT:    "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT:    "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT:    "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT:    "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT:    "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // gamistic palette
        gold: {
          DEFAULT: "#f59e0b",
          dark:    "#d97706",
          light:   "#fcd34d",
        },
        game: {
          bg:      "#080d18",
          card:    "#0f1629",
          "card2": "#111d3a",
          border:  "rgba(245,158,11,0.2)",
        },
        cyan:   "#06b6d4",
        "neon-purple": "#8b5cf6",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        gold:      "0 0 15px rgba(245,158,11,0.3)",
        "gold-lg": "0 0 30px rgba(245,158,11,0.4), 0 8px 32px rgba(0,0,0,0.5)",
        game:      "0 4px 24px rgba(0,0,0,0.6)",
      },
      backgroundImage: {
        "gradient-gold": "linear-gradient(135deg, #d97706, #f59e0b)",
        "gradient-dark": "linear-gradient(135deg, #0f1629 0%, #111d3a 100%)",
        "gradient-card": "linear-gradient(180deg, #0f1629 0%, #0a1020 100%)",
      },
    },
  },
  plugins: [],
} satisfies Config;
