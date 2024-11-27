import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Public Sans', 'sans-serif'],
      },
      colors: {
        main: '#FFDC58',
        mainAccent: '#ffc800',
        overlay: 'rgba(0,0,0,0.8)',
        
        // light mode
        bg: '#FEF2E8',
        text: '#000',
        border: '#000',

        // dark mode
        darkBg: '#374151',
        darkText: '#eeefe9',
        darkBorder: '#000',
        secondaryBlack: '#212121',

        // shadcn required colors
        background: 'var(--background)',
        foreground: 'var(--foreground)',
      },
      borderRadius: {
        base: '5px',
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      boxShadow: {
        light: '4px 4px 0px 0px #000',
        dark: '4px 4px 0px 0px #000',
      },
      translate: {
        boxShadowX: '4px',
        boxShadowY: '4px',
        reverseBoxShadowX: '-4px',
        reverseBoxShadowY: '-4px',
      },
      fontWeight: {
        base: '500',
        heading: '700',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
