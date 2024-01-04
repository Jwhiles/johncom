/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: {
        "spin-slow": "spin 300s linear infinite",
      },
    },
    fontFamily: {
      sans: ["ui-sans-serif", "system-ui", ],
      header: ["Garamond", "system"],
    },
  },
  plugins: [],
};
