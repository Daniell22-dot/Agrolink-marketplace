/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        agrolink: {
          green: '#15803D',      // Primary emerald green (matches frontend index.css)
          orange: '#F97316',     // E-commerce accent orange (Jumia style)
          lightGreen: '#DCFCE7', // Soft mint accent
          darkGreen: '#166534',  // Rich forest green
        }
      }
    },
  },
  plugins: [],
}

