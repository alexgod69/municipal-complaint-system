/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#0d0d14',
          secondary: '#13131f',
          card: '#1a1a2a',
          hover: '#212135',
        },
        accent: {
          blue: '#4f8ef7',
          green: '#22d3a0',
          orange: '#f97316',
        },
        muted: '#8888aa',
        border: '#2a2a3e',
      },
      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
