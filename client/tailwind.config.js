/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0F172A",
        primary: "#6366F1",
        accent: "#A855F7",
        textMain: "#E5E7EB",
        card: "#1E293B",
      },
    },
  },
  plugins: [],
};