/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'deep-grey': '#1a1a1b',
        'vibrant-purple': '#8b5cf6',
      },
    },
  },
  plugins: [],
}
