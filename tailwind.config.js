/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",  // If your components are in src
    "./app/**/*.{js,jsx,ts,tsx}",  // If you use Next.js App Router
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
