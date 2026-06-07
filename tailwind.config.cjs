/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./App.tsx"
  ],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: '#1a1a1a',
          foreground: '#ffffff'
        },
        secondary: {
          DEFAULT: '#f4f4f5',
          foreground: '#1a1a1a'
        },
        accent: {
          DEFAULT: '#ffffff',
          foreground: '#1a1a1a'
        }
      },
      fontFamily: {
        sans: ["'Inter'", "sans-serif"],
        serif: ["'Lora'", "serif"],
      },
      borderRadius: {
        '3xl': '1.5rem',
        '4xl': '2rem',
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
};