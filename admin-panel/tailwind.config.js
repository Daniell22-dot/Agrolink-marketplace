/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#0E3D2B',
          light: '#164A35',
        },
        amber: {
          DEFAULT: '#C89B3C',
          hover: '#B88A2F',
        },
        surface: '#F0F1F2',
        background: '#F4F4F4',
        ink: '#16191F',
        muted: '#6B7280',
        border: '#D5D9D9',
        danger: '#CC1B1B',
        success: '#1D8A4E',
        info: '#2E6FDE',
      }
    }
  },
  plugins: []
}
