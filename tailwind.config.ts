import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      animation: {
        "spin-slow": "spin 300s linear infinite",
      },
    },
    fontFamily: {
      // sans: ["system"],
      header: ["Garamond", "system"],
    },
  },
  plugins: [],
} satisfies Config;
