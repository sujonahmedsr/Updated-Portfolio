import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

export default {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        heading: ['var(--font-space-grotesk)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      colors: {
        background: '#0A0A0A',
        foreground: '#F5F5F0',
        card: {
          DEFAULT: '#121212',
          foreground: '#F5F5F0',
        },
        muted: {
          DEFAULT: '#161616',
          foreground: '#A1A1A1',
        },
        accent: {
          DEFAULT: '#7CFF6B',
          foreground: '#0A0A0A',
        },
        border: '#222222',
        input: '#1A1A1A',
        ring: '#7CFF6B',
      },
      borderRadius: {
        lg: '0.75rem',
        md: '0.5rem',
        sm: '0.25rem'
      }
    }
  },
  plugins: [tailwindcssAnimate],
} satisfies Config;
