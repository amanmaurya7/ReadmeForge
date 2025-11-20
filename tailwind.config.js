/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f2f4ff',
          100: '#dfe4ff',
          200: '#b9c4ff',
          300: '#93a4ff',
          400: '#6d84ff',
          500: '#4763ff',
          600: '#2f48e6',
          700: '#2135b3',
          800: '#162280',
          900: '#0c1152',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        body: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 10px 40px rgba(71, 99, 255, 0.15)',
      },
    },
  },
  plugins: [],
}
