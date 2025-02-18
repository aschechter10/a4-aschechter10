/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}", // Include all the app routes and components
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}", // If you're using any pages outside of the App Router
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}", // Include components
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [],
};
