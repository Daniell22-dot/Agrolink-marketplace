/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        agrolink: {
          green: '#22C55E',
          orange: '#ff8c00',
          lightGreen: '#86EFAC',
          darkGreen: '#16A34A',
        }
      }
    },
  },
  plugins: [],
}

