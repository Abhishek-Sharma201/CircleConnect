/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      keyframes: {
        gradient: {
          "0%, 100%": { "background-position": "0% 50%" },
          "50%": { "background-position": "100% 50%" },
        },
        shadow: {
          '0%, 100%': { 'box-shadow': '0 0 3px rgba(29, 78, 216, 1)' },
          '50%': { 'box-shadow': '0 0 3px rgba(255, 255, 255, 1)' },
        },
      },
      animation: {
        "gradient-shadow": "gradient 2.5s ease infinite, shadow 5s ease infinite",
      },
    },
  },
  plugins: [],
};
