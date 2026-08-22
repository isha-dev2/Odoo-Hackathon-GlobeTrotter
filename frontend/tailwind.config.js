/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f7ff',
          100: '#e0effe',
          500: '#0284c7',
          600: '#0284c7',
          700: '#0369a1',
        },
        dark: {
          bg: '#0b0f17',
          card: '#131b2e',
          border: '#1f293d',
        }
      },
    },
  },
  plugins: [],
}
