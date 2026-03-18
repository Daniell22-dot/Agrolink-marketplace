/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        agrolink: {
          green: '#2d8c3e',
          orange: '#ff8c00',
          lightGreen: '#4caf50',
          darkGreen: '#1b5e20',
        }
      }
    },
  },
  plugins: [],
}

