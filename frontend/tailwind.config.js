/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'heading': ['Cinzel', '"Palatino Linotype"', 'serif'],
        'subheading': ['Inter', 'sans-serif'],
        'body': ['Inter', 'sans-serif'],
        'poppins': ['Poppins', '"Poppins Fallback"', 'sans-serif'], // Kept for backward compatibility
      },
    },
  },
  plugins: [],
}