/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'heading': ['"DM Serif Display"', 'serif'],
        'body': ['"DM Sans"', 'sans-serif'],
        'poppins': ['Poppins', '"Poppins Fallback"', 'sans-serif'], // Kept for backward compatibility
      },
    },
  },
  plugins: [],
}