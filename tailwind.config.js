/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./app.js",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        sjp: {
          maroon: {
            deep: '#2a040b',
            dark: '#420712',
            DEFAULT: '#5c0919',
            light: '#800d23',
            vibrant: '#99152e',
          },
          gold: {
            dark: '#b48505',
            DEFAULT: '#f59e0b',
            accent: '#d4af37',
            light: '#fbbf24',
            bright: '#fde047',
          }
        }
      },
      fontFamily: {
        display: ['Outfit', 'sans-serif'],
        body: ['Plus Jakarta Sans', 'sans-serif'],
      },
      boxShadow: {
        'glass-sm': '0 4px 16px 0 rgba(0, 0, 0, 0.25)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'glass-lg': '0 16px 48px 0 rgba(0, 0, 0, 0.45)',
        'gold-glow': '0 0 25px -4px rgba(245, 158, 11, 0.4)',
        'maroon-glow': '0 0 35px -5px rgba(92, 9, 25, 0.6)',
      },
      backdropBlur: {
        'xs': '2px',
        '3xl': '40px',
      }
    },
  },
  plugins: [],
};
