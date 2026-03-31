/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      colors: {
        background: "var(--geist-background)",
        foreground: "var(--geist-foreground)",
        accents: {
          1: "var(--accents-1)",
          2: "var(--accents-2)",
          3: "var(--accents-3)",
          4: "var(--accents-4)",
          5: "var(--accents-5)",
          6: "var(--accents-6)",
          7: "var(--accents-7)",
          8: "var(--accents-8)",
        },
        success: {
          light: "var(--geist-success-light)",
          DEFAULT: "var(--geist-success)",
          dark: "var(--geist-success-dark)",
        },
        error: {
          light: "var(--geist-error-light)",
          DEFAULT: "var(--geist-error)",
          dark: "var(--geist-error-dark)",
        },
        warning: {
          light: "var(--geist-warning-light)",
          DEFAULT: "var(--geist-warning)",
          dark: "var(--geist-warning-dark)",
        },
        pg: {
          DEFAULT: "var(--pg-border)",
          raised: "var(--geist-background)",
          hover: "var(--accents-1)",
          text: {
            primary: "var(--geist-foreground)",
            secondary: "var(--accents-5)",
            ghost: "var(--accents-3)",
          },
        },
      },
      keyframes: {
        'grid-flow': {
          '0%': { transform: 'translateY(-40px) rotateX(60deg)' },
          '100%': { transform: 'translateY(0) rotateX(60deg)' }
        }
      },
      animation: {
        'grid-flow': 'grid-flow 2s linear infinite',
      },
      borderColor: {
        DEFAULT: "var(--accents-2)",
        strong: "var(--accents-5)",
      },
      boxShadow: {
        sm: "0 1px 2px rgba(0,0,0,0.05)",
        md: "0 4px 6px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.03)",
        lg: "0 8px 30px rgba(0,0,0,0.12)",
        xl: "0 30px 60px rgba(0,0,0,0.12)",
      },
      borderRadius: {
        geist: "6px",
      },
    },
  },
  plugins: [],
};
